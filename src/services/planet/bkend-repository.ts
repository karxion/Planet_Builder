import type { CloudProject, PlanetProject } from "@/types/planet-project";
import { readBoundedResponse } from "@/services/io/bounded-stream";

type AuthSession = { accessToken: string; refreshToken?: string; email?: string };
type JsonRecord = Record<string, unknown>;
type AuthState = { session: AuthSession | null; refreshing?: Promise<void> };
type RequestOptions = { state?: AuthState; retry?: boolean; authenticate?: boolean };

const API_BASE = import.meta.env.VITE_BKEND_API_URL?.replace(/\/$/, "") ?? "";
const PROJECT_ID = import.meta.env.VITE_BKEND_PROJECT_ID ?? "";
const ENVIRONMENT = import.meta.env.VITE_BKEND_ENV ?? "dev";
const PUBLISHABLE_KEY = import.meta.env.VITE_BKEND_PUBLISHABLE_KEY ?? "";
const REVISION_TABLE = "/data/project_revisions";
const concurrencyReady = () => import.meta.env.VITE_BKEND_CONCURRENCY === "immutable-v1";
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
  if (PUBLISHABLE_KEY) headers.set("X-API-Key", PUBLISHABLE_KEY);
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
  return Boolean(API_BASE && (PROJECT_ID || PUBLISHABLE_KEY));
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
  const state = getAuthState();
  const heads = new Map<string, CloudRevision>();
  for (let page = 1; page <= 100; page++) {
    const result = await request<RevisionPage>(`${REVISION_TABLE}?sortBy=createdAt&sortDirection=desc&limit=100&page=${page}`, {}, { state });
    const rows = Array.isArray(result) ? result : result.items;
    if (!Array.isArray(rows)) throw new Error("클라우드 리비전 목록이 올바르지 않습니다");
    for (const row of rows) {
      assertRevision(row);
      if (!heads.has(row.projectId) || heads.get(row.projectId)!.revision < row.revision) heads.set(row.projectId, row);
    }
    if (!(Array.isArray(result) ? rows.length === 100 : result.pagination?.hasNext ?? rows.length === 100))
      return [...heads.values()].filter(row => !row.deleted).map(asProject).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  throw new Error("클라우드 리비전 목록 제한을 초과했습니다. 관리자에게 문의해 주세요");
}

interface CloudRevision extends CloudProject {
  projectId: string;
  revisionKey: string;
  projectCreatedAt: string;
  deleted: boolean;
}
type RevisionPage = CloudRevision[] | { items: CloudRevision[]; pagination?: { hasNext?: boolean } };
function assertRevision(value: unknown): asserts value is CloudRevision {
  if (!isRecord(value) || typeof value.projectId !== "string" || !value.projectId ||
      !Number.isSafeInteger(value.revision) || Number(value.revision) < 1 ||
      value.revisionKey !== revisionKey(String(value.projectId), Number(value.revision)) ||
      typeof value.deleted !== "boolean" ||
      !["id", "name", "fileId", "projectCreatedAt", "createdAt", "updatedAt"].every(key => typeof value[key] === "string") ||
      value.schemaVersion !== 1 || typeof value.sourceFmgVersion !== "string" ||
      typeof value.sizeBytes !== "number" || value.sizeBytes < 0)
    throw new Error("클라우드 리비전 응답이 올바르지 않습니다");
}
const revisionKey = (id: string, revision: number) => JSON.stringify([id, revision]);
function asProject(row: CloudRevision): CloudProject {
  return { id: row.projectId, name: row.name, fileId: row.fileId, schemaVersion: row.schemaVersion,
    sourceFmgVersion: row.sourceFmgVersion, revision: row.revision, sizeBytes: row.sizeBytes,
    createdAt: row.projectCreatedAt, updatedAt: row.createdAt };
}
function requireConcurrency(): void {
  if (!concurrencyReady()) throw new Error("클라우드 충돌 방지 설정이 필요합니다. 로컬 FPB 파일로 저장해 주세요");
}
async function currentRevision(project: CloudProject, state: AuthState): Promise<CloudRevision> {
  const query = new URLSearchParams({ andFilters: JSON.stringify({ projectId: project.id }), sortBy: "revision", sortDirection: "desc", limit: "1" });
  const result = await request<RevisionPage>(`${REVISION_TABLE}?${query}`, {}, { state });
  const rows = Array.isArray(result) ? result : result.items;
  const current = rows?.[0];
  if (!current) throw new ProjectConflictError();
  assertRevision(current);
  if (current.projectId !== project.id || current.deleted || current.revision !== project.revision || current.fileId !== project.fileId)
    throw new ProjectConflictError();
  return current;
}
async function appendRevision(record: Omit<CloudRevision, "id" | "createdAt" | "updatedAt">, state: AuthState): Promise<CloudProject> {
  let saved: unknown;
  try {
    saved = await request(REVISION_TABLE, { method: "POST", body: JSON.stringify(record) }, { state });
  } catch (error) {
    if (error instanceof BkendRequestError && error.status === 409) throw new ProjectConflictError();
    throw error;
  }
  assertRevision(saved);
  if (saved.revisionKey !== record.revisionKey || saved.fileId !== record.fileId) throw new Error("클라우드 저장 응답이 일치하지 않습니다");
  return asProject(saved);
}

async function save(project: PlanetProject, blob: Blob, existing?: CloudProject): Promise<CloudProject> {
  if (blob.size > 20 * 1024 * 1024) throw new Error("클라우드 저장은 압축 후 20MB까지 지원합니다");
  requireConcurrency();
  const state = getAuthState();

  if (existing) {
    await currentRevision(existing, state);
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

    const projectId = existing?.id ?? crypto.randomUUID();
    const revision = (existing?.revision ?? 0) + 1;
    const record = {
      projectId,
      revisionKey: revisionKey(projectId, revision),
      projectCreatedAt: existing?.createdAt ?? new Date().toISOString(),
      deleted: false,
      name: project.planet.name,
      fileId,
      schemaVersion: project.schemaVersion,
      sourceFmgVersion: project.source.fmgVersion,
      revision,
      sizeBytes: blob.size
    };
    assertCurrent(state);
    metadataStarted = true;
    saved = await appendRevision(record, state);
  } catch (error) {
    // Network errors, timeouts and 5xx after a metadata write may hide a committed record.
    const rejected =
      error instanceof BkendRequestError && error.status >= 400 && error.status < 500 && error.status !== 408;
    if (fileId && (!metadataStarted || rejected || error instanceof ProjectConflictError)) await deleteFile(fileId, state);
    throw error;
  }

  // Retain previous files: an older revision or in-flight reader may still reference them.
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
  return appendMetadata(project, { name: name.trim() });
}

async function remove(project: CloudProject): Promise<void> {
  await appendMetadata(project, { deleted: true });
}

async function appendMetadata(project: CloudProject, update: { name?: string; deleted?: boolean }): Promise<CloudProject> {
  requireConcurrency();
  if (update.name !== undefined && (!update.name || update.name.length > 200)) throw new Error("프로젝트 이름을 확인해주세요");
  const state = getAuthState();
  const current = await currentRevision(project, state);
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...record } = current;
  return appendRevision({ ...record, ...update, revision: current.revision + 1,
    revisionKey: revisionKey(project.id, current.revision + 1) }, state);
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
