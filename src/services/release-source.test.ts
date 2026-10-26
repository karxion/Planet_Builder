import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { prepareRelease, RELEASE_PATHS, sourceHash } from "../../scripts/release-source";

describe("Single-source Site release", () => {
  it("copies the pinned commit, rejects dirty targets, and detects input changes", () => {
    const root = mkdtempSync(join(tmpdir(), "fpb-release-test-"));
    const source = join(root, "source");
    const target = join(root, "site");
    const write = (base: string, path: string, value: string) => {
      mkdirSync(dirname(join(base, path)), { recursive: true });
      writeFileSync(join(base, path), value);
    };
    const git = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
    try {
      for (const directory of [source, target]) {
        mkdirSync(directory);
        git(directory, "init", "--quiet");
        write(directory, ".openai/hosting.json", '{"project_id":"same-site"}');
      }
      for (const path of RELEASE_PATHS) write(source, ["src", "public"].includes(path) ? `${path}/example.txt` : path, path);
      git(source, "add", ".");
      git(source, "-c", "user.name=test", "-c", "user.email=test@example.test", "-c", "core.hooksPath=/dev/null", "commit", "-qm", "pinned");
      const commit = git(source, "rev-parse", "HEAD");
      write(target, ".gitignore", ".env\n");
      write(target, ".env", "private=preserve");
      git(target, "add", ".");
      git(target, "-c", "user.name=test", "-c", "user.email=test@example.test", "-c", "core.hooksPath=/dev/null", "commit", "-qm", "site");
      write(source, "src/example.txt", "uncommitted source must not leak");
      prepareRelease(source, target, commit);
      expect(readFileSync(join(target, "src/example.txt"), "utf8")).toBe("src");
      expect(readFileSync(join(target, ".env"), "utf8")).toBe("private=preserve");
      const provenance = JSON.parse(readFileSync(join(target, ".openai/release.json"), "utf8"));
      expect(provenance.commit).toBe(commit);
      expect(provenance.sourceHash).toBe(sourceHash(target));
      write(target, "src/example.txt", "one\r\ntwo");
      const windowsHash = sourceHash(target);
      write(target, "src/example.txt", "one\ntwo");
      expect(sourceHash(target)).toBe(windowsHash);
      write(target, "src/example.txt", "changed");
      expect(sourceHash(target)).not.toBe(provenance.sourceHash);
      expect(() => prepareRelease(source, target, commit)).toThrow("uncommitted");
      expect(() => prepareRelease(source, source, commit)).toThrow("separate");
    } finally {
      if (!realpathSync(root).startsWith(realpathSync(tmpdir()))) throw new Error("Unsafe test directory");
      rmSync(root, { recursive: true, force: true });
    }
  });
});
