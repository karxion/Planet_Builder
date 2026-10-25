import { describe, expect, it } from "vitest";
import { csvCell, encodeCsvRows } from "./csv";

describe("Shared safe CSV output", () => {
  it.each([
    "=1+1",
    "+SUM(A1)",
    "-1+2",
    "@SUM(A1)",
    " \t=1",
    "\rheader",
    "\nheader",
    "\ttext"
  ])("neutralizes spreadsheet formulas and control prefixes: %j", value => expect(csvCell(value)).toBe(`"'${value}"`));
  it("preserves Korean, escapes delimiters, quotes and newlines, and uses BOM/CRLF", () => {
    expect(
      encodeCsvRows([
        ["국가", 'a,"b"'],
        ["은빛 왕국", "줄1\n줄2"]
      ])
    ).toBe('\uFEFF"국가","a,""b"""\r\n"은빛 왕국","줄1\n줄2"');
  });
});
