/** Quoting alone does not stop spreadsheet formula execution. */
export function csvCell(value: string): string {
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function encodeCsvRows(rows: readonly (readonly string[])[]): string {
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
}

declare global {
  interface Window {
    encodeFpbCsvRows: typeof encodeCsvRows;
  }
}
if (typeof window !== "undefined") window.encodeFpbCsvRows = encodeCsvRows;
