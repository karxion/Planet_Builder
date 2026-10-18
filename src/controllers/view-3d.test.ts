import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  stop: vi.fn(),
  ensureEl: vi.fn()
}));
vi.mock("@/utils", () => ({ ensureEl: mocks.ensureEl }));
vi.mock("@/renderers/view-3d-renderer", () => ({ create: mocks.create, stop: mocks.stop }));

function deferred() {
  let resolve!: (value: boolean) => void;
  const promise = new Promise<boolean>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("3D view transitions", () => {
  let view: typeof import("./view-3d").View3d;
  let elements: Map<string, ReturnType<typeof element>>;
  let inserted: ReturnType<typeof vi.fn>;
  let state: { threeD: { isOn: boolean } };

  function element(id: string) {
    const classes = new Set<string>();
    return {
      id,
      dataset: {} as Record<string, string>,
      style: {} as Record<string, string>,
      offsetParent: {},
      classList: {
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
        contains: (name: string) => classes.has(name)
      },
      querySelectorAll: (): unknown[] => [...elements.values()].filter(item => item.classList.contains("pressed")),
      remove: () => elements.delete(id),
      getBoundingClientRect: () => ({ height: 60 })
    };
  }

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    elements = new Map();
    inserted = vi.fn((canvas: ReturnType<typeof element>) => elements.set(canvas.id, canvas));
    state = { threeD: { isOn: false } };
    mocks.ensureEl.mockImplementation((id: string) => {
      if (!elements.has(id)) elements.set(id, element(id));
      return elements.get(id);
    });
    mocks.stop.mockImplementation(() => {
      state.threeD.isOn = false;
    });
    mocks.create.mockImplementation(async () => {
      state.threeD.isOn = true;
      return true;
    });
    vi.stubGlobal("options", state);
    vi.stubGlobal("window", {
      innerWidth: 1440,
      innerHeight: 900,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    vi.stubGlobal("document", {
      getElementById: (id: string) => elements.get(id) ?? null,
      createElement: () => element("canvas3d"),
      body: { insertBefore: inserted }
    });
    vi.stubGlobal("$", () => ({ dialog: vi.fn() }));
    view = (await import("./view-3d")).View3d;
  });

  afterEach(() => vi.unstubAllGlobals());

  it("does not attach a stale canvas after switching back to 2D", async () => {
    const pending = deferred();
    mocks.create.mockImplementation(() => {
      state.threeD.isOn = true;
      return pending.promise;
    });
    const opening = view.open("viewGlobe");
    await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
    const closing = view.enterStandard();
    pending.resolve(true);
    await opening;
    await closing;
    expect(inserted).not.toHaveBeenCalled();
    expect(state.threeD.isOn).toBe(false);
  });

  it("serializes renderer creation and keeps only the newest view", async () => {
    const pending = deferred();
    mocks.create.mockImplementationOnce(() => {
      state.threeD.isOn = true;
      return pending.promise;
    });
    const first = view.open("viewGlobe");
    await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
    const second = view.open("viewGlobe");
    expect(mocks.create).toHaveBeenCalledOnce();
    pending.resolve(true);
    await first;
    await second;
    expect(mocks.create).toHaveBeenCalledTimes(2);
    expect(inserted).toHaveBeenCalledOnce();
    expect(mocks.stop.mock.invocationCallOrder[0]).toBeLessThan(mocks.create.mock.invocationCallOrder[1]);
  });

  it("cleans up a failed renderer and allows a later retry", async () => {
    mocks.create.mockImplementationOnce(async () => {
      state.threeD.isOn = true;
      throw new Error("WebGL unavailable");
    });
    await expect(view.open("viewGlobe")).rejects.toThrow("WebGL unavailable");
    expect(state.threeD.isOn).toBe(false);
    expect(elements.get("viewStandard")?.classList.contains("pressed")).toBe(true);
    await view.open("viewGlobe");
    expect(inserted).toHaveBeenCalledOnce();
  });

  it("does not leave the 3D button pressed when initialization returns false", async () => {
    mocks.create.mockResolvedValueOnce(false);
    await view.open("viewGlobe");
    expect(inserted).not.toHaveBeenCalled();
    expect(elements.get("viewStandard")?.classList.contains("pressed")).toBe(true);
  });
});
