declare const __FPB_BUILD__: { version: string; commit: string; sourceHash: string; schemaVersion: number };
export const BUILD_INFO = typeof __FPB_BUILD__ === "undefined"
  ? { version: "dev", commit: "local", sourceHash: "", schemaVersion: 1 }
  : __FPB_BUILD__;
window.addEventListener("load", () => {
  const info = document.createElement("p");
  info.id = "fpb-build-info";
  info.dataset.i18nSkip = "";
  info.textContent = `v${BUILD_INFO.version} · ${BUILD_INFO.commit.slice(0, 12)} · schema ${BUILD_INFO.schemaVersion}`;
  info.title = `${BUILD_INFO.commit}\n${BUILD_INFO.sourceHash}`;
  document.getElementById("aboutContent")?.append(info);
});
