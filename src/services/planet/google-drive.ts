import { readBoundedResponse } from "@/services/io/bounded-stream";
import { MAX_PROJECT_BYTES } from "./project-codec";

const CLIENT_ID =
  import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID ??
  "1009720427725-89275bti276lai30d8vsj10hoqunmjgc.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const API = "https://www.googleapis.com/drive/v3/files";
interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
}
interface GoogleIdentity {
  accounts: {
    oauth2: {
      initTokenClient(options: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback: () => void;
      }): { requestAccessToken(options: { prompt: string }): void };
      revoke(token: string, callback: () => void): void;
    };
  };
}
export interface DriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
}
let token = "";
let expiresAt = 0;
let authGeneration = 0;
let sdkPromise: Promise<void> | undefined;
const identity = () => (window as unknown as { google?: GoogleIdentity }).google;

export function prepareDrive(): Promise<void> {
  if (identity()?.accounts?.oauth2) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    const timer = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timer);
      script.remove();
      sdkPromise = undefined;
      reject(new Error("Google 연결 모듈을 불러오지 못했습니다. 네트워크를 확인하고 다시 시도하세요."));
    }
    script.onerror = fail;
    script.onload = () => {
      window.clearTimeout(timer);
      if (identity()?.accounts?.oauth2) resolve();
      else fail();
    };
    document.head.append(script);
  });
  return sdkPromise;
}

export function driveConnected(): boolean {
  return !!token && Date.now() < expiresAt;
}

/** Call synchronously from a click after prepareDrive, so browsers allow the popup. */
export function connectDrive(): Promise<void> {
  const google = identity();
  if (!google) return Promise.reject(new Error("Google 연결 모듈이 아직 준비되지 않았습니다."));
  const generation = ++authGeneration;
  return new Promise((resolve, reject) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: result => {
          if (generation !== authGeneration) {
            reject(new Error("연결 요청이 취소되었습니다."));
            return;
          }
          if (result.error || !result.access_token || !result.scope?.split(" ").includes(SCOPE)) {
            reject(new Error("Google Drive 파일 접근 권한을 허용해 주세요."));
            return;
          }
          token = result.access_token;
          expiresAt = Date.now() + Math.max(0, (Number(result.expires_in) || 0) - 60) * 1000;
          resolve();
        },
        error_callback: () => reject(new Error("Google 연결 창이 닫혔거나 열리지 않았습니다. 다시 연결해 주세요."))
      })
      .requestAccessToken({ prompt: "select_account" });
  });
}

export function disconnectDrive(): void {
  const previous = token;
  token = "";
  expiresAt = 0;
  authGeneration++;
  if (previous) identity()?.accounts.oauth2.revoke(previous, () => {});
}

function accessToken(): string {
  if (!driveConnected()) throw new Error("Google Drive에 다시 연결해 주세요.");
  return token;
}

async function request(url: string, init: RequestInit = {}): Promise<Response> {
  const current = accessToken();
  const response = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${current}` } });
  if (current !== token) throw new Error("Google 계정 연결이 변경되었습니다. 다시 시도해 주세요.");
  if (response.status === 401) {
    token = "";
    expiresAt = 0;
    throw new Error("Google 연결이 만료되었습니다. 다시 연결해 주세요.");
  }
  if (!response.ok) throw new Error(`Google Drive 요청 실패 (${response.status}). 권한과 저장 용량을 확인해 주세요.`);
  return response;
}

export async function listDriveFiles(): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({
      q: "trashed = false and appProperties has { key='fpb' and value='1' }",
      fields: "nextPageToken,files(id,name,modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: "100"
    });
    if (pageToken) params.set("pageToken", pageToken);
    const data = await (await request(`${API}?${params}`)).json();
    if (!Array.isArray(data.files)) throw new Error("Google Drive 파일 목록 응답이 올바르지 않습니다.");
    for (const file of data.files) {
      if (typeof file.id !== "string" || typeof file.name !== "string")
        throw new Error("파일 정보가 올바르지 않습니다.");
      files.push({ id: file.id, name: file.name, modifiedTime: file.modifiedTime });
    }
    pageToken = typeof data.nextPageToken === "string" ? data.nextPageToken : "";
  } while (pageToken);
  return files;
}

/** Each manual save creates a snapshot; never overwrite another device's work. */
export async function saveDriveFile(name: string, blob: Blob): Promise<void> {
  if (blob.size > MAX_PROJECT_BYTES) throw new Error("프로젝트 파일이 크기 제한을 초과했습니다.");
  const boundary = `fpb-${crypto.randomUUID()}`;
  const metadata = JSON.stringify({
    name: `${name || "행성"}-${new Date().toISOString().replace(/[:.]/g, "-")}.fpb`,
    mimeType: "application/octet-stream",
    appProperties: { fpb: "1" }
  });
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`,
    blob,
    `\r\n--${boundary}--\r\n`
  ]);
  await request("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body
  });
}

export async function loadDriveFile(id: string): Promise<Blob> {
  return readBoundedResponse(await request(`${API}/${encodeURIComponent(id)}?alt=media`), MAX_PROJECT_BYTES);
}
