import type { DraftRecovery } from "@/types/editor-draft";

export interface RecoverySnapshot {
  id: string;
  projectId: string;
  name: string;
  savedAt: string;
  sequence?: number;
  blob: Blob;
  drafts?: DraftRecovery;
  draftBytes?: number;
}

const DATABASE = "fpb-recovery";
const STORE = "snapshots";
const MAX_PROJECTS = 5;
const MAX_SNAPSHOTS = 3;
const MAX_BYTES = 100 * 1024 * 1024;
const recentFirst = (a: RecoverySnapshot, b: RecoverySnapshot) =>
  (b.sequence || 0) - (a.sequence || 0) || b.savedAt.localeCompare(a.savedAt);

export function retainSnapshots(records: RecoverySnapshot[], newest: RecoverySnapshot): RecoverySnapshot[] {
  const sorted = [newest, ...records.filter(record => record.id !== newest.id).sort(recentFirst)];
  const counts = new Map<string, number>();
  let bytes = 0;
  return sorted.filter(record => {
    const count = counts.get(record.projectId) || 0;
    if (record.id !== newest.id && (count >= MAX_SNAPSHOTS || (!count && counts.size >= MAX_PROJECTS))) return false;
    const size = record.blob.size + (record.draftBytes || 0);
    if (record.id !== newest.id && bytes + size > MAX_BYTES) return false;
    counts.set(record.projectId, count + 1);
    bytes += size;
    return true;
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let blocked = false;
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
    request.onerror = () => reject(request.error || new Error("Recovery database unavailable"));
    request.onblocked = () => {
      blocked = true;
      reject(new Error("Recovery database blocked by another tab"));
    };
    request.onsuccess = () => {
      if (blocked) request.result.close();
      else resolve(request.result);
    };
  });
}

export class RecoveryRepository {
  constructor(private open: () => Promise<IDBDatabase> = openDatabase) {}

  async list(): Promise<RecoverySnapshot[]> {
    const db = await this.open();
    try {
      return await new Promise<RecoverySnapshot[]>((resolve, reject) => {
        const transaction = db.transaction(STORE, "readonly");
        const request = transaction.objectStore(STORE).getAll();
        transaction.oncomplete = () => resolve(request.result.sort(recentFirst));
        transaction.onabort = transaction.onerror = () =>
          reject(transaction.error || new Error("Recovery read failed"));
      });
    } finally {
      db.close();
    }
  }

  async save(snapshot: RecoverySnapshot): Promise<void> {
    const db = await this.open();
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE, "readwrite");
        const store = transaction.objectStore(STORE);
        const request = store.getAll();
        request.onsuccess = () => {
          const sequence =
            Math.max(0, ...(request.result as RecoverySnapshot[]).map(record => record.sequence || 0)) + 1;
          const saved = { ...snapshot, sequence };
          const retained = retainSnapshots(request.result, saved);
          const ids = new Set(retained.map(record => record.id));
          for (const record of request.result as RecoverySnapshot[]) if (!ids.has(record.id)) store.delete(record.id);
          store.put(saved);
        };
        // A successful put is not durable until its transaction commits.
        transaction.oncomplete = () => resolve();
        transaction.onabort = transaction.onerror = () =>
          reject(transaction.error || new Error("Recovery write failed"));
      });
    } finally {
      db.close();
    }
  }

  async legacy(): Promise<Blob | undefined> {
    return new Promise((resolve, reject) => {
      let missing = false;
      let blocked = false;
      const request = indexedDB.open("d2");
      // A read-only migration must not create an empty legacy database without its store.
      request.onupgradeneeded = () => {
        missing = true;
        request.transaction!.abort();
      };
      request.onerror = () =>
        missing ? resolve(undefined) : reject(request.error || new Error("Legacy recovery unavailable"));
      request.onblocked = () => {
        blocked = true;
        reject(new Error("Legacy recovery blocked"));
      };
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) {
          db.close();
          return;
        }
        if (!db.objectStoreNames.contains("s")) {
          db.close();
          resolve(undefined);
          return;
        }
        const transaction = db.transaction("s", "readonly");
        const get = transaction.objectStore("s").get("lastPlanetProject");
        transaction.oncomplete = () => {
          db.close();
          resolve(get.result?.value);
        };
        transaction.onabort = transaction.onerror = () => {
          db.close();
          reject(transaction.error || new Error("Legacy recovery read failed"));
        };
      };
    });
  }
}
