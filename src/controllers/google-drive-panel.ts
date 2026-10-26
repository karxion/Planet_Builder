import {
  connectDrive,
  disconnectDrive,
  driveConnected,
  listDriveFiles,
  loadDriveFile,
  prepareDrive,
  saveDriveFile
} from "@/services/planet/google-drive";

export function renderDrivePanel(
  container: HTMLElement,
  callbacks: {
    save: (upload: (name: string, blob: Blob) => Promise<void>) => Promise<void>;
    open: (download: () => Promise<Blob>) => Promise<void>;
  }
): void {
  container.innerHTML = `<h3>Google Drive</h3><p>행성 파일을 내 Drive에 저장하고 다른 기기에서 열 수 있습니다. 저장할 때마다 새 사본을 만듭니다.</p><div class="fpb-dialog-actions"><button type="button" data-drive="connect">Google Drive 연결</button><button type="button" data-drive="save">현재 행성 저장</button><button type="button" data-drive="refresh">저장 목록</button><button type="button" data-drive="disconnect">연결 해제</button></div><p data-drive="status" role="status" aria-live="polite"></p><div data-drive="files" class="fpb-cloud-list"></div>`;
  const status = container.querySelector<HTMLElement>('[data-drive="status"]')!;
  const files = container.querySelector<HTMLElement>('[data-drive="files"]')!;
  const button = (name: string) => container.querySelector<HTMLButtonElement>(`[data-drive="${name}"]`)!;
  let ready = false;
  let busy = false;
  function update() {
    const connected = driveConnected();
    button("connect").hidden = connected;
    button("connect").disabled = busy || !ready;
    for (const name of ["save", "refresh", "disconnect"]) button(name).disabled = busy || !connected;
    files.querySelectorAll<HTMLButtonElement>("button").forEach(element => {
      element.disabled = busy || !connected;
    });
  }
  async function action(task: () => Promise<void>) {
    if (busy) return;
    busy = true;
    status.textContent = "처리 중…";
    update();
    try {
      await task();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Google Drive 작업에 실패했습니다.";
    } finally {
      busy = false;
      update();
    }
  }
  async function refresh() {
    const items = await listDriveFiles();
    files.replaceChildren();
    for (const item of items) {
      const row = document.createElement("button");
      row.type = "button";
      row.textContent = item.name;
      row.addEventListener(
        "click",
        () =>
          void action(async () => {
            await callbacks.open(() => loadDriveFile(item.id));
            status.textContent = "불러오기 작업 완료";
          })
      );
      files.append(row);
    }
    status.textContent = items.length ? `${items.length}개의 저장 파일` : "이 앱으로 Drive에 저장한 파일이 없습니다.";
  }
  button("connect").onclick = () => {
    const pending = connectDrive();
    void action(async () => {
      await pending;
      await refresh();
    });
  };
  button("save").onclick = () =>
    void action(async () => {
      await callbacks.save(saveDriveFile);
      await refresh();
    });
  button("refresh").onclick = () => void action(refresh);
  button("disconnect").onclick = () => {
    disconnectDrive();
    files.replaceChildren();
    status.textContent = "연결을 해제했습니다. 저장된 파일은 Drive에 유지됩니다.";
    update();
  };
  update();
  void prepareDrive()
    .then(() => {
      ready = true;
      status.textContent = driveConnected() ? "Google Drive 연결됨" : "Google 계정으로 연결해 주세요.";
      update();
      if (driveConnected()) void action(refresh);
    })
    .catch(error => {
      status.textContent = `${error.message} 창을 닫고 다시 열어 재시도하세요.`;
    });
}
