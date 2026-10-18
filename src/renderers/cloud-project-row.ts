import type { CloudProject } from "@/types/planet-project";

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderCloudProjectRow(project: CloudProject, language: string): string {
  const id = escapeHtml(project.id);
  const name = escapeHtml(project.name);
  const revision = escapeHtml(project.revision);
  const date = new Date(project.updatedAt).toLocaleString(language === "ko" ? "ko-KR" : "en-US");
  const size = (project.sizeBytes / 1024 / 1024).toFixed(1);
  return `<article class="fpb-project-row"><div><strong data-i18n-skip>${name}</strong><small data-i18n-skip>${date} · ${size}MB · r${revision}</small></div><div><button data-action="open" data-id="${id}" type="button">열기</button><button data-action="rename" data-id="${id}" type="button">이름 변경</button><button data-action="delete" data-id="${id}" class="danger" type="button">삭제</button></div></article>`;
}
