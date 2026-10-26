import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RELEASE_PATHS = ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "vitest.config.ts", ".gitattributes", "LICENSE", "scripts/release-source.ts"];
export function sourceHash(root: string): string {
  const hash = createHash("sha256");
  const visit = (path: string) => {
    const absolute = join(root, path);
    for (const entry of readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      if (entry.name === "node_modules") continue;
      const relative = `${path}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Release symlink is not allowed: ${relative}`);
      if (entry.isDirectory()) visit(relative);
      else hash.update(relative).update("\0").update(readFileSync(join(root, relative))).update("\0");
    }
  };
  for (const path of RELEASE_PATHS) {
    if (!existsSync(join(root, path))) throw new Error(`Missing release input: ${path}`);
    if (lstatSync(join(root, path)).isSymbolicLink()) throw new Error(`Release symlink is not allowed: ${path}`);
    if (["src", "public"].includes(path)) visit(path);
    else hash.update(path).update("\0").update(readFileSync(join(root, path))).update("\0");
  }
  return hash.digest("hex");
}

export function prepareRelease(repository: string, targetPath: string, ref: string): void {
  const source = realpathSync(repository);
  const target = realpathSync(targetPath);
  const git = (args: string[], cwd = source) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  if (target === source || git(["rev-parse", "--show-toplevel"], target).replaceAll("\\", "/") !== target.replaceAll("\\", "/"))
    throw new Error("Use a separate Site Git checkout");
  if (git(["status", "--porcelain"], target)) throw new Error("Site checkout has uncommitted changes");
  const commit = git(["rev-parse", "--verify", `${ref}^{commit}`]);
  const canonical = JSON.parse(git(["show", `${commit}:.openai/hosting.json`]));
  const hosting = JSON.parse(readFileSync(join(target, ".openai/hosting.json"), "utf8"));
  if (canonical.project_id !== hosting.project_id) throw new Error("Site identity mismatch");
  const temporary = mkdtempSync(join(tmpdir(), "fpb-release-"));
  try {
    const archive = join(temporary, "source.tar");
    git(["archive", "--format=tar", `--output=${archive}`, commit, ...RELEASE_PATHS]);
    execFileSync("tar", ["-xf", archive, "-C", temporary]);
    sourceHash(temporary);
    for (const path of RELEASE_PATHS) {
      const destination = resolve(target, path);
      if (!destination.startsWith(target + "/") && !destination.startsWith(target + "\\")) throw new Error("Unsafe release path");
      mkdirSync(dirname(destination), { recursive: true });
      const parent = realpathSync(dirname(destination));
      if (parent !== target && !parent.startsWith(target + "/") && !parent.startsWith(target + "\\")) throw new Error("Unsafe release parent");
      if (existsSync(destination) && (lstatSync(destination).isSymbolicLink() || !realpathSync(destination).startsWith(target))) throw new Error("Unsafe release destination");
      rmSync(destination, { recursive: true, force: true });
      cpSync(join(temporary, path), destination, { recursive: true });
    }
    // The Site identity is retained; application files only come from the pinned commit.
    writeFileSync(join(target, ".openai/release.json"), JSON.stringify({
      repository: "https://github.com/karxion/Planet_Builder", commit, sourceHash: sourceHash(target)
    }, null, 2) + "\n");
  } finally {
    if (!realpathSync(temporary).startsWith(realpathSync(tmpdir()))) throw new Error("Unsafe temporary path");
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [target, ref] = process.argv.slice(2);
  if (!target || !ref) throw new Error("Usage: node scripts/release-source.ts <Site-checkout> <GitHub-commit>");
  if (!/^[a-f0-9]{40}$/.test(ref)) throw new Error("Pass the full pinned GitHub commit SHA");
  const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const remote = execFileSync("git", ["remote", "get-url", "origin"], { cwd: repository, encoding: "utf8" }).trim();
  if (remote !== "https://github.com/karxion/Planet_Builder.git") throw new Error("Unexpected source repository");
  execFileSync("git", ["fetch", "origin", "main"], { cwd: repository });
  execFileSync("git", ["merge-base", "--is-ancestor", ref, "origin/main"], { cwd: repository });
  prepareRelease(repository, target, ref);
}
