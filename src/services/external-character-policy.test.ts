// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createLocalEncounterNote } from "@/data/local-encounter";
import { removeDeorumFromNotes, stripDeorumContent } from "./external-character-policy";

describe("Deorum separation", () => {
  it.each([
    "https://deorum.vercel.app/encounter/7",
    "//deorum.vercel.app/encounter/7",
    "https://DEORUM.vercel.app/",
    "https://x.deorum.vercel.app/"
  ])("removes an old external frame without removing custom notes: %s", url => {
    const result = stripDeorumContent(`<p><b>내 기록</b></p><iframe src="${url}"></iframe><p>유지</p>`);
    expect(result).toContain("<b>내 기록</b>");
    expect(result).toContain("유지");
    expect(result).not.toContain("iframe");
  });
  it("unwraps only matching links and removes matching external media", () => {
    const result = stripDeorumContent(
      '<a href="https://deorum.vercel.app"><b>내 링크 설명</b></a><object data="https://deorum.vercel.app/a"></object><img src="https://deorum.vercel.app/a.png"><a href="https://example.org">참고</a>'
    );
    expect(result).toContain("<b>내 링크 설명</b>");
    expect(result).toContain('href="https://example.org"');
    expect(result).not.toMatch(/object|img|deorum/);
  });
  it.each([
    "<p>직접 작성한 내용</p>",
    '<a href="https://deorum.vercel.app.example.org">독립 사이트</a>',
    "<p>Deorum은 외부 서비스이다.</p>"
  ])("preserves unrelated HTML byte-for-byte: %s", html => expect(stripDeorumContent(html)).toBe(html));
  it("migrates note bodies once without replacing IDs, names or other data", () => {
    const notes = [
      {
        id: "marker7",
        name: "내 조우",
        custom: true,
        legend: '<p>메모</p><iframe src="https://deorum.vercel.app/encounter/1"></iframe>'
      }
    ];
    expect(removeDeorumFromNotes(notes)).toBe(true);
    expect(notes[0]).toEqual({ id: "marker7", name: "내 조우", custom: true, legend: "<p>메모</p>" });
    expect(removeDeorumFromNotes(notes)).toBe(false);
  });
  it("creates encounter notes without any external resource", () => {
    const note = createLocalEncounterNote("marker7");
    expect(note.id).toBe("marker7");
    expect(note.legend).not.toMatch(/iframe|https?:|src=|href=/i);
  });
});
