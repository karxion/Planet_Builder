import type { CloudProject, PlanetProject } from "@/types/planet-project";
import { readBoundedResponse } from "@/services/io/bounded-stream";

type AuthSession = { accessToken: string; refreshToken?: string; email?: string };
type JsonRecord = Record<string, unknown>;
type AuthState = { session: AuthSession | null; refreshing?: Promise<void> };
type RequestOptions = { state?: AuthState; retry?: boolean; authenticate?: boolean };

const API_BASE = import.meta.env.VITE_BKEND_API_URL?.replace(/\/$/, "") ?? "";
const PROJECT_ID = import.meta.env.VITE_BKEND_PROJECT_ID ?? "";
const ENVIRONMENT = import.meta.env.VITE_BKEND_ENV ?? "dev";
const SESSION_KEY = "fpb-bkend-session";
let authState: AuthState = { session: null };

class BkendRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export class ProjectConflictError extends Error {
  constructor() {
    super("클라우드에 더 새로운 버전이 있습니다");
    this.name = "ProjectConflictError";
  }
}

function getSession(): AuthSession | null {
  try {
    const value = sessionStorage.getItem(SESSION_KEY);
    const session: unknown = value ? JSON.parse(value) : null;
    if (!isRecord(session)) return null;
    const accessToken = nonemptyString(session.accessToken);
    if (!accessToken) return null;
    return {
      accessToken,
      refreshToken: nonemptyString(session.refreshToken),
      email: typeof session.email === "string" ? session.email : undefined
    };
  } catch {
    return null;
  }
}

function setSession(session: AuthSession | null): void {
  if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION_KEY);
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonemptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getAuthState(): AuthState {
  const session = getSession();
  const current = authState.session;
  if (
    session?.accessToken !== current?.accessToken ||
    session?.refreshToken !== current?.refreshToken ||
    session?.email !== current?.email
  ) {
    authState = { session };
  }
  return authState;
}

function beginAuthChange(): AuthState {
  authState = { session: getSession() };
  return authState;
}

function assertCurrent(state: AuthState): void {
  if (getAuthState() !== state) throw new Error("인증 세션이 변경되었습니다. 다시 시도해 주세요");
}

function readTokens(result: unknown, email?: string, refreshToken?: string): AuthSession {
  const record = isRecord(result) ? result : {};
  const value = record.tokens ?? record.token ?? record;
  const tokens = isRecord(value) ? value : {};
  const accessToken = nonemptyString(tokens.accessToken ?? tokens.access_token);
  if (!accessToken) throw new Error("로그인 토큰을 받지 못했습니다");
  const nextRefreshToken = tokens.refreshToken ?? tokens.refresh_token;
  if (nextRefreshToken != null && !nonemptyString(nextRefreshToken)) {
    throw new Error("유효한 갱신 토큰을 받지 못했습니다");
  }
  return { accessToken, refreshToken: nonemptyString(nextRefreshToken) ?? refreshToken, email };
}

async function request<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T> {
  if (!isConfigured()) throw new Error("bkend.ai 환경 변수가 설정되지 않았습니다");
  const { state = getAuthState(), retry = true, authenticate = true } = options;
  assertCurrent(state);
  const session = authenticate ? state.session : null;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  headers.set("x-project-id", PROJECT_ID);
  headers.set("x-environment", ENVIRONMENT);
  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });

  if (response.status === 401 && retry && session?.refreshToken) {
    assertCurrent(state);
    // A delayed 401 may belong to the token another request has already refreshed.
    if (state.session === session) await refresh(state);
    return request<T>(path, init, { state, retry: false, authenticate });
  }

  const text = await response.text();
  let body: unknown = {};
  try {
    if (text) body = JSON.parse(text);
  } catch {
    if (response.ok) throw new Error("bkend 응답이 올바른 JSON이 아닙니다");
  }
  const record = isRecord(body) ? body : {};
  if (!response.ok) {
    const error = isRecord(record.error) ? record.error : {};
    throw new BkendRequestError(
      String(error.message ?? record.message ?? `bkend 요청 실패 (${response.status})`),
      response.status
    );
  }
  return (Object.hasOwn(record, "data") ? record.data : body) as T;
}

function isConfigured(): boolean {
  return Boolean(API_BASE && PROJECT_ID);
}

async function signUp(email: string, password: string): Promise<void> {
  const state = beginAuthChange();
  await request(
    "/auth/email/signup",
    { method: "POST", body: JSON.stringify({ email, password }) },
    { state, retry: false, authenticate: false }
  );
  await authenticate(email, password, state);
}

async function signIn(email: string, password: string): Promise<void> {
  await authenticate(email, password, beginAuthChange());
}

async function authenticate(email: string, password: string, state: AuthState): Promise<void> {
  const result = await request<unknown>(
    "/auth/email/signin",
    { method: "POST", body: JSON.stringify({ email, password }) },
    { state, retry: false, authenticate: false }
  );
  assertCurrent(state);
  const session = readTokens(result, email);
  setSession(session);
  authState = { session };
}

function refresh(state: AuthState): Promise<void> {
  if (state.refreshing) return state.refreshing;
  const session = state.session!;
  state.refreshing = (async () => {
    const result = await request<unknown>(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken: session.refreshToken }) },
      { state, retry: false }
    );
    assertCurrent(state);
    const refreshed = readTokens(result, session.email, session.refreshToken);
    setSession(refreshed);
    state.session = refreshed;
  })().finally(() => {
    state.refreshing = undefined;
  });
  return state.refreshing;
}

async function signOut(): Promise<void> {
  const state = beginAuthChange();
  // Start with the old credentials, but clear local auth before waiting for the server.
  const pending = request("/auth/signout", { method: "POST" }, { state, retry: false });
  try {
    setSession(null);
    state.session = null;
  } finally {
    await pending;
  }
}

async function list(): Promise<CloudProject[]> {
  const result = await request<{ items?: CloudProject[] } | CloudProject[]>(
    "/data/projects?sort=updatedAt:desc&limit=100"
  );
  return Array.isArray(result) ? result : (result.items ?? []);
}

async function save(project: PlanetProject, blob: Blob, existing?: CloudProject): Promise<CloudProject> {
  if (blob.size > 20 * 1024 * 1024) throw new Error("클라우드 저장은 압축 후 20MB까지 지원합니다");
  const state = getAuthState();

  if (existing) {
    const remote = await request<CloudProject>(`/data/projects/${encodeURIComponent(existing.id)}`, {}, { state });
    if (remote.revision !== existing.revision) throw new ProjectConflictError();
  }

  const filename = `${sanitizeFilename(project.planet.name)}.fpb`;
  const upload = await request<JsonRecord>(
    "/files/presigned-url",
    {
      method: "POST",
      body: JSON.stringify({
        filename,
        contentType: blob.type,
        size: blob.size,
        visibility: "private",
        category: "documents"
      })
    },
    { state }
  );
  const uploadUrl = isRecord(upload) ? nonemptyString(upload.url ?? upload.uploadUrl) : undefined;
  const fileId = isRecord(upload) ? nonemptyString(upload.fileId ?? upload.id) : undefined;
  if (fileId && fileId === existing?.fileId) throw new Error("기존 파일과 다른 업로드 파일이 필요합니다");

  let metadataStarted = false;
  let saved: CloudProject;
  try {
    if (!uploadUrl || !fileId) throw new Error("파일 업로드 URL을 만들지 못했습니다");
    assertCurrent(state);
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": blob.type }
    });
    if (!uploadResponse.ok) throw new Error("클라우드 파일 업로드에 실패했습니다");

    await request(
      "/files",
      {
        method: "POST",
        body: JSON.stringify({ fileId, filename, contentType: blob.type, size: blob.size, visibility: "private" })
      },
      { state }
    );

    const record = {
      name: project.planet.name,
      fileId,
      schemaVersion: project.schemaVersion,
      sourceFmgVersion: project.source.fmgVersion,
      revision: (existing?.revision ?? 0) + 1,
      sizeBytes: blob.size
    };
    assertCurrent(state);
    metadataStarted = true;
    saved = await request<CloudProject>(
      existing ? `/data/projects/${encodeURIComponent(existing.id)}` : "/data/projects",
      { method: existing ? "PATCH" : "POST", body: JSON.stringify(record) },
      { state }
    );
  } catch (error) {
    // Network errors, timeouts and 5xx after a metadata write may hide a committed record.
    const rejected =
      error instanceof BkendRequestError && error.status >= 400 && error.status < 500 && error.status !== 408;
    if (fileId && (!metadataStarted || rejected)) await deleteFile(fileId, state);
    throw error;
  }

  if (existing?.fileId && existing.fileId !== fileId) {
    void deleteFile(existing.fileId, state);
  }
  return saved;
}

async function load(project: CloudProject): Promise<Blob> {
  const result = await request<JsonRecord>(`/files/${encodeURIComponent(project.fileId)}/download-url`, {
    method: "POST"
  });
  const url = isRecord(result) ? nonemptyString(result.url ?? result.downloadUrl) : undefined;
  if (!url) throw new Error("다운로드 URL을 만들지 못했습니다");
  const response = await fetch(url);
  if (!response.ok) throw new Error("클라우드 프로젝트를 내려받지 못했습니다");
  return readBoundedResponse(response);
}

async function rename(project: CloudProject, name: string): Promise<CloudProject> {
  return request(`/data/projects/${encodeURIComponent(project.id)}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
}

async function remove(project: CloudProject): Promise<void> {
  const state = getAuthState();
  await request(`/data/projects/${encodeURIComponent(project.id)}`, { method: "DELETE" }, { state });
  await deleteFile(project.fileId, state);
}

async function deleteFile(fileId: string, state: AuthState): Promise<void> {
  await request(`/files/${encodeURIComponent(fileId)}`, { method: "DELETE" }, { state }).catch(() => undefined);
}

function sanitizeFilename(value: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Filenames must exclude ASCII control characters.
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
