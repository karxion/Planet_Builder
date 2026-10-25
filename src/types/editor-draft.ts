export type EditorDraftValues = Record<string, string>;

export interface EditorDraftSnapshot {
  key: string;
  baseline: EditorDraftValues;
  values: EditorDraftValues;
}

export interface DraftRecovery {
  schemaVersion: 1;
  projectId: string;
  snapshotId: string;
  entries: EditorDraftSnapshot[];
}
