import type { CloudProject } from "@/types/planet-project";

/** Keeps pending saves bound to the document that started them. */
export class ProjectSession {
  private generation = 0;
  private queues: Record<"local" | "cloud", Promise<void>> = {
    local: Promise.resolve(),
    cloud: Promise.resolve()
  };
  cloudProject: CloudProject | undefined;

  capture(): number {
    return this.generation;
  }

  isCurrent(generation: number): boolean {
    return generation === this.generation;
  }

  reset(): void {
    this.generation++;
    this.cloudProject = undefined;
  }

  run<T>(channel: "local" | "cloud", generation: number, task: () => Promise<T>): Promise<T | undefined> {
    const pending = this.queues[channel].then(() => (this.isCurrent(generation) ? task() : undefined));
    this.queues[channel] = pending.then(
      () => {},
      () => {}
    );
    return pending;
  }
}
