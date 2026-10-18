import { describe, expect, it } from "vitest";
import { ProjectSession } from "./project-session";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("ProjectSession", () => {
  it("invalidates old documents and clears their cloud binding", () => {
    const session = new ProjectSession();
    const previous = session.capture();
    session.cloudProject = { id: "old" } as NonNullable<typeof session.cloudProject>;
    session.reset();
    expect(session.isCurrent(previous)).toBe(false);
    expect(session.cloudProject).toBeUndefined();
  });

  it("skips queued saves belonging to a replaced document", async () => {
    const session = new ProjectSession();
    const blocker = deferred();
    const generation = session.capture();
    const first = session.run("local", generation, () => blocker.promise);
    await Promise.resolve();
    let called = false;
    const stale = session.run("local", generation, async () => {
      called = true;
    });
    session.reset();
    const current = session.run("local", session.capture(), async () => "new document");
    blocker.resolve();
    await first;
    await stale;
    expect(called).toBe(false);
    expect(await current).toBe("new document");
  });

  it("serializes cloud revisions and continues after a failed save", async () => {
    const session = new ProjectSession();
    const events: number[] = [];
    const first = session.run("cloud", session.capture(), async () => {
      events.push(1);
      throw new Error("offline");
    });
    const second = session.run("cloud", session.capture(), async () => {
      events.push(2);
    });
    await expect(first).rejects.toThrow("offline");
    await second;
    expect(events).toEqual([1, 2]);
  });

  it("does not block local recovery while a cloud request is pending", async () => {
    const session = new ProjectSession();
    const blocker = deferred();
    const cloud = session.run("cloud", session.capture(), () => blocker.promise);
    expect(await session.run("local", session.capture(), async () => "saved")).toBe("saved");
    blocker.resolve();
    await cloud;
  });
});
