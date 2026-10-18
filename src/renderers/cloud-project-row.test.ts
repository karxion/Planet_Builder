import { describe, expect, it } from "vitest";
import type { CloudProject } from "@/types/planet-project";
import { renderCloudProjectRow } from "./cloud-project-row";

const project: CloudProject = {
  id: "planet-1",
  name: "세레온",
  fileId: "file-1",
  schemaVersion: 1,
  sourceFmgVersion: "1.135.0",
  revision: 2,
  sizeBytes: 1024 * 1024,
  createdAt: "2026-10-11T00:00:00Z",
  updatedAt: "2026-10-11T00:00:00Z"
};

describe("cloud project rows", () => {
  it("renders all project actions and metadata", () => {
    const row = renderCloudProjectRow(project, "ko");
    expect(row).toContain("세레온");
    expect(row).toContain("1.0MB · r2");
    expect(row.match(/data-id="planet-1"/g)).toHaveLength(3);
  });

  it("escapes names and quoted IDs instead of creating markup or event attributes", () => {
    const row = renderCloudProjectRow(
      { ...project, id: '" onclick="alert(1)', name: "<img src=x onerror=alert(1)> & '" },
      "en"
    );
    expect(row).not.toContain("<img");
    expect(row).not.toContain('data-id="" onclick=');
    expect(row).toContain('data-id="&quot; onclick=&quot;alert(1)"');
    expect(row).toContain("&lt;img src=x onerror=alert(1)&gt; &amp; &#39;");
  });

  it("does not trust runtime revision types received from the server", () => {
    const row = renderCloudProjectRow(
      { ...project, revision: "<script>bad()</script>" } as unknown as CloudProject,
      "ko"
    );
    expect(row).not.toContain("<script>");
    expect(row).toContain("&lt;script&gt;");
  });
});
