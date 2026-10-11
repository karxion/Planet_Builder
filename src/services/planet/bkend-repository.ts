import type { CloudProject, PlanetProject } from "@/types/planet-project";

type AuthSession = { accessToken: string; refreshToken?: string; email?: string };
type JsonRecord = Record<string, unknown>;

const API_BASE = import.meta.env.VITE_BKEND_API_URL?.replace(/\/$/, "") ?? "";
const PROJECT_ID = import.meta.env.VITE_BKEND_PROJECT_ID ?? "";
const ENVIRONMENT = import.meta.env.VITE_BKEND_ENV ?? "dev";
const SESSION_KEY = "fpb-bkend-session";

export class ProjectConflictError extends Error {
  constructor() {
    super("클라우드에 더 새로운 버전이 있습니다");
    this.name = "ProjectConflictError";
  }
}

function getSession(): AuthSession | null {
  const value = sessionStorage.getItem(SESSION_KEY);
  return value ? (JSON.parse(value) as AuthSession) : null;
}

function setSession(session: AuthSession | null): void {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  if (!isConfigured()) throw new Error("bkend.ai 환경 변수가 설정되지 않았습니다");
  const session = getSession();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-project-id": PROJECT_ID,
      "x-environment": ENVIRONMENT,
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      ...init.headers
    }
  });

  if (response.status === 401 && retry && session?.refreshToken) {
    await refresh(session.refreshToken);
    return request<T>(path, init, false);
  }

  const body = (await response.json().catch(() => ({}))) as JsonRecord;
  if (!response.ok) {
    const error = body.error as JsonRecord | undefined;
    throw new Error(String(error?.message ?? body.message ?? `bkend 요청 실패 (${response.status})`));
  }
  return (body.data ?? body) as T;
}

function isConfigured(): boolean {
  return Boolean(API_BASE && PROJECT_ID);
}

async function signUp(email: string, password: string): Promise<void> {
  await request("/auth/email/signup", { method: "POST", body: JSON.stringify({ email, password }) });
  await signIn(email, password);
}

async function signIn(email: string, password: string): Promise<void> {
  const result = await request<JsonRecord>("/auth/email/signin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  const tokens = (result.tokens ?? result.token ?? result) as JsonRecord;
  const accessToken = String(tokens.accessToken ?? tokens.access_token ?? "");
  if (!accessToken) throw new Error("로그인 토큰을 받지 못했습니다");
  setSession({
    accessToken,
    refreshToken: String(tokens.refreshToken ?? tokens.refresh_token ?? "") || undefined,
    email
  });
}

async function refresh(refreshToken: string): Promise<void> {
  const result = await request<JsonRecord>(
    "/auth/refresh",
    { method: "POST", body: JSON.stringify({ refreshToken }) },
    false
  );
  const current = getSession();
  setSession({
    accessToken: String(result.accessToken ?? result.access_token),
    refreshToken: String(result.refreshToken ?? result.refresh_token ?? refreshToken),
    email: current?.email
  });
}

async function signOut(): Promise<void> {
  try {
    await request("/auth/signout", { method: "POST" }, false);
  } finally {
    setSession(null);
  }
}

async function list(): Promise<CloudProject[]> {
  const result = await request<{ items?: CloudProject[] } | CloudProject[]>("/data/projects?sort=updatedAt:desc&limit=100");
  return Array.isArray(result) ? result : (result.items ?? []);
}

async function save(project: PlanetProject, blob: Blob, existing?: CloudProject): Promise<CloudProject> {
  if (blob.size > 20 * 1024 * 1024) throw new Error("클라우드 저장은 압축 후 20MB까지 지원합니다");

  if (existing) {
    const remote = await request<CloudProject>(`/data/projects/${existing.id}`);
    if (remote.revision !== existing.revision) throw new ProjectConflictError();
  }

  const filename = `${sanitizeFilename(project.planet.name)}.fpb`;
  const upload = await request<JsonRecord>("/files/presigned-url", {
    method: "POST",
    body: JSON.stringify({ filename, contentType: blob.type, size: blob.size, visibility: "private", category: "documents" })
  });
  const uploadUrl = String(upload.url ?? upload.uploadUrl ?? "");
  const fileId = String(upload.fileId ?? upload.id ?? "");
  if (!uploadUrl || !fileId) throw new Error("파일 업로드 URL을 만들지 못했습니다");

  const uploadResponse = await fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": blob.type } });
  if (!uploadResponse.ok) throw new Error("클라우드 파일 업로드에 실패했습니다");

  await request("/files", {
    method: "POST",
    body: JSON.stringify({ fileId, filename, contentType: blob.type, size: blob.size, visibility: "private" })
  });

  const record = {
    name: project.planet.name,
    fileId,
    schemaVersion: project.schemaVersion,
    sourceFmgVersion: project.source.fmgVersion,
    revision: (existing?.revision ?? 0) + 1,
    sizeBytes: blob.size
  };
  const saved = existing
    ? await request<CloudProject>(`/data/projects/${existing.id}`, { method: "PATCH", body: JSON.stringify(record) })
    : await request<CloudProject>("/data/projects", { method: "POST", body: JSON.stringify(record) });

  if (existing?.fileId && existing.fileId !== fileId) {
    void request(`/files/${existing.fileId}`, { method: "DELETE" }).catch(() => undefined);
  }
  return saved;
}

async function load(project: CloudProject): Promise<Blob> {
  const result = await request<JsonRecord>(`/files/${project.fileId}/download-url`, { method: "POST" });
  const url = String(result.url ?? result.downloadUrl ?? "");
  if (!url) throw new Error("다운로드 URL을 만들지 못했습니다");
  const response = await fetch(url);
  if (!response.ok) throw new Error("클라우드 프로젝트를 내려받지 못했습니다");
  return response.blob();
}

async function rename(project: CloudProject, name: string): Promise<CloudProject> {
  return request(`/data/projects/${project.id}`, { method: "PATCH", body: JSON.stringify({ name }) });
}

async function remove(project: CloudProject): Promise<void> {
  await request(`/data/projects/${project.id}`, { method: "DELETE" });
  await request(`/files/${project.fileId}`, { method: "DELETE" }).catch(() => undefined);
}

function sanitizeFilename(value: string): string {
  return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "fantasy-planet";
}

export const ProjectRepository = {
  isConfigured,
  isAuthenticated: () => Boolean(getSession()?.accessToken),
  getEmail: () => getSession()?.email ?? "",
  signUp,
  signIn,
  signOut,
  list,
  save,
  load,
  rename,
  remove
};
