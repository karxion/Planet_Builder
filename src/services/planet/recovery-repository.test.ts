import { afterEach, describe, expect, it, vi } from "vitest";
import { createDraftRecovery } from "./draft-recovery";
import { RecoveryRepository, type RecoverySnapshot, retainSnapshots } from "./recovery-repository";

const snapshot = (projectId: string, index: number): RecoverySnapshot => ({
  id: `${projectId}:${index}`,
  projectId,
  name: projectId,
  savedAt: new Date(2026, 0, 1, 0, index).toISOString(),
  blob: new Blob([`project ${index}`])
});

function database(records: RecoverySnapshot[] = []) {
  const request = { result: records, onsuccess: null as (() => void) | null };
  const store = { getAll: () => request, delete: vi.fn(), put: vi.fn() };
  const transaction = {
    objectStore: () => store,
    oncomplete: null as (() => void) | null,
    onabort: null as (() => void) | null,
    onerror: null as (() => void) | null,
    error: null as DOMException | null
  };
  const db = { transaction: vi.fn(() => transaction), close: vi.fn() };
  const repository = new RecoveryRepository(async () => db as unknown as IDBDatabase);
  return { repository, request, store, transaction, db };
}

describe("Recovery history retention", () => {
  it("keeps three generations per project and five recent projects", () => {
    const records = Array.from({ length: 7 }).flatMap((_, project) =>
      Array.from({ length: 5 }, (_, index) => snapshot(`project${project}`, project * 5 + index))
    );
    const kept = retainSnapshots(records, snapshot("project6", 40));
    expect(new Set(kept.map(record => record.projectId)).size).toBe(5);
    expect(kept).toHaveLength(15);
    expect(kept.filter(record => record.projectId === "project6").map(record => record.id)).toEqual([
      "project6:40",
      "project6:34",
      "project6:33"
    ]);
  });

  it("protects the new snapshot even if the clock moves backwards", () => {
    const newest = snapshot("current", 0);
    const future = Array.from({ length: 10 }, (_, index) => snapshot(`future${index}`, index + 1));
    expect(retainSnapshots(future, newest)[0]).toBe(newest);
  });

  it("limits older blob bytes without dropping the current recovery", () => {
    const large = { ...snapshot("current", 2), blob: { size: 80 * 1024 * 1024 } as Blob };
    const old = { ...snapshot("previous", 1), blob: { size: 30 * 1024 * 1024 } as Blob };
    expect(retainSnapshots([old], large)).toEqual([large]);
    const oversized = { ...large, blob: { size: 110 * 1024 * 1024 } as Blob };
    expect(retainSnapshots([old], oversized)).toEqual([oversized]);
  });

  it("accounts for draft metadata and replaces the same head without consuming a generation", () => {
    const records = [0, 1, 2].map(index => snapshot("current", index));
    const updated = { ...records[2], draftBytes: 1024 };
    expect(retainSnapshots(records, updated)).toHaveLength(3);
    const large = { ...updated, blob: { size: 97 * 1024 * 1024 } as Blob, draftBytes: 4 * 1024 * 1024 };
    expect(retainSnapshots(records, large)).toEqual([large]);
  });
});

describe("Recovery transaction boundaries", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("reports saved only after commit, not after issuing put", async () => {
    const { repository, request, store, transaction, db } = database();
    let completed = false;
    const pending = repository.save(snapshot("current", 1)).then(() => {
      completed = true;
    });
    await Promise.resolve();
    request.onsuccess!();
    expect(store.put).toHaveBeenCalledOnce();
    await Promise.resolve();
    expect(completed).toBe(false);
    transaction.oncomplete!();
    await pending;
    expect(completed).toBe(true);
    expect(db.close).toHaveBeenCalledOnce();
  });

  it("rejects quota aborts and closes the database rather than reporting success", async () => {
    const { repository, request, transaction, db } = database();
    const pending = repository.save(snapshot("current", 1));
    await Promise.resolve();
    request.onsuccess!();
    transaction.error = new DOMException("Full", "QuotaExceededError");
    transaction.onabort!();
    await expect(pending).rejects.toMatchObject({ name: "QuotaExceededError" });
    expect(db.close).toHaveBeenCalledOnce();
  });

  it("prunes old generations and writes the replacement in one transaction", async () => {
    const old = [0, 1, 2].map(index => snapshot("current", index));
    const { repository, request, store, transaction, db } = database(old);
    const pending = repository.save(snapshot("current", 3));
    await Promise.resolve();
    request.onsuccess!();
    expect(db.transaction).toHaveBeenCalledWith("snapshots", "readwrite");
    expect(store.delete).toHaveBeenCalledWith("current:0");
    expect(store.put).toHaveBeenCalledWith(expect.objectContaining({ id: "current:3" }));
    transaction.oncomplete!();
    await pending;
  });

  it("writes the world blob and its matching drafts in the same committed record", async () => {
    const base = snapshot("current", 3);
    const paired = {
      ...base,
      ...createDraftRecovery([{ key: "planet-settings", baseline: { name: "old" }, values: { name: "pending" } }], base)
    };
    const { repository, request, store, transaction } = database();
    const pending = repository.save(paired);
    await Promise.resolve();
    request.onsuccess!();
    expect(store.put).toHaveBeenCalledWith(
      expect.objectContaining({ blob: base.blob, drafts: paired.drafts, draftBytes: paired.draftBytes })
    );
    transaction.oncomplete!();
    await pending;
  });

  it("waits for a successful read transaction and sorts newest first", async () => {
    const { repository, transaction, db } = database([snapshot("one", 1), snapshot("two", 2)]);
    const pending = repository.list();
    await Promise.resolve();
    transaction.oncomplete!();
    expect((await pending).map(record => record.projectId)).toEqual(["two", "one"]);
    expect(db.close).toHaveBeenCalledOnce();
  });

  it("uses transaction sequence rather than the wall clock to select the latest recovery", async () => {
    const future = { ...snapshot("old", 10), sequence: 1 };
    const current = { ...snapshot("current", 0), sequence: 2 };
    const { repository, transaction } = database([future, current]);
    const pending = repository.list();
    await Promise.resolve();
    transaction.oncomplete!();
    expect((await pending)[0].projectId).toBe("current");
  });

  it("surfaces database open and read failures", async () => {
    const unavailable = new RecoveryRepository(async () => {
      throw new Error("unavailable");
    });
    await expect(unavailable.save(snapshot("one", 1))).rejects.toThrow("unavailable");
    const { repository, transaction, db } = database();
    const pending = repository.list();
    await Promise.resolve();
    transaction.onerror!();
    await expect(pending).rejects.toThrow("Recovery read failed");
    expect(db.close).toHaveBeenCalledOnce();
  });

  it("does not create a broken legacy database when none exists", async () => {
    const request = {
      onupgradeneeded: null as (() => void) | null,
      onerror: null as (() => void) | null,
      transaction: { abort: vi.fn() }
    };
    vi.stubGlobal("indexedDB", { open: vi.fn(() => request) });
    const pending = new RecoveryRepository().legacy();
    request.onupgradeneeded!();
    expect(request.transaction.abort).toHaveBeenCalledOnce();
    request.onerror!();
    expect(await pending).toBeUndefined();
  });

  it("reads the old recovery blob only after commit and keeps it in place", async () => {
    const blob = new Blob(["legacy"]);
    const get = vi.fn(() => ({ result: { value: blob } }));
    const transaction = { objectStore: () => ({ get }), oncomplete: null as (() => void) | null };
    const close = vi.fn();
    const request = {
      result: { objectStoreNames: { contains: () => true }, transaction: () => transaction, close },
      onsuccess: null as (() => void) | null
    };
    vi.stubGlobal("indexedDB", { open: () => request });
    const pending = new RecoveryRepository().legacy();
    request.onsuccess!();
    expect(get).toHaveBeenCalledWith("lastPlanetProject");
    transaction.oncomplete!();
    expect(await pending).toBe(blob);
    expect(close).toHaveBeenCalledOnce();
  });
});
