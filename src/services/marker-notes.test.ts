// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { readableInscription, translateMarkerName, translateMarkerText } from "@/data/marker-localization";
import { localizedMapNote, renderMapNote } from "@/services/marker-notes";
import { setUiLanguage } from "@/services/ui-language";

const ancient = {
  id: "marker12",
  name: "은빛 Stele",
  legend:
    'An ancient stele. It has an inscription, but no one can translate it:\n<div style="font-size: 1.8em; line-break: anywhere;">\ud800�𐠁Ⲳ᠐</div>'
};

beforeEach(() => {
  document.body.innerHTML = '<div id="notes"><div id="notesHeader"></div><div id="notesBody"></div></div>';
  setUiLanguage("ko");
});

describe("generated marker localization", () => {
  it("replaces legacy broken inscriptions with readable Korean without changing stored notes", () => {
    const original = structuredClone(ancient);
    const ko = localizedMapNote(ancient, "ko");
    expect(ko.name).toBe("은빛 비석");
    expect(ko.legend).toContain("고대의 비석입니다");
    expect(ko.legend).toContain("비문은 아직 해독되지 않았습니다");
    expect(ko.legend).not.toMatch(/[�\ud800-\udfff]/);
    expect(ancient).toEqual(original);
  });

  it("renders English from the same source and never restores unreadable runes", () => {
    const en = localizedMapNote(ancient, "en");
    expect(en.name).toBe("은빛 Stele");
    expect(en.legend).toContain("An ancient stele");
    expect(en.legend).toContain("The inscription has not yet been deciphered");
    expect(en.legend).not.toMatch(/[�\ud800-\udfff]/);
    expect(readableInscription(readableInscription(ancient.legend))).toBe(readableInscription(ancient.legend));
  });

  it("updates an already visible note when the language changes", () => {
    globalThis.notes = [ancient];
    renderMapNote(ancient);
    expect(document.getElementById("notesBody")!.textContent).toContain("비문");
    setUiLanguage("en");
    expect(document.getElementById("notesBody")!.textContent).toContain("An ancient stele");
    setUiLanguage("ko");
    expect(document.getElementById("notesHeader")!.textContent).toBe("은빛 비석");
  });

  it("preserves custom notes, valid non-Latin text, links and unknown prose", () => {
    const note = {
      id: "marker3",
      name: "My Stele",
      legend: '<p>직접 작성한 𐠁 이야기. My story.</p><a href="https://example.com">자료</a>'
    };
    expect(localizedMapNote(note, "ko")).toEqual(note);
    const customBlock = 'My inscription: <div style="font-size: 1.8em; line-break: anywhere;">𐠁</div>';
    expect(readableInscription(customBlock)).toBe(customBlock);
    expect(localizedMapNote({ ...ancient, id: "burg2" }, "ko").name).toBe(ancient.name);
  });

  it("continues sanitizing user HTML and blocks script-bearing translated fragments", () => {
    const result = localizedMapNote(
      {
        id: "marker3",
        name: "<img onerror=alert(1)>",
        legend:
          '<script>alert(1)</script><p>Pirate ships have been spotted in these waters.</p><img src=x onerror="alert(1)">'
      },
      "ko"
    );
    expect(result.legend).not.toMatch(/script|onerror/);
    expect(result.legend).toContain("해적선");
  });

  it.each([
    ["Dormant volcano. Height: 1200 m.", "휴면 중인 화산"],
    [
      "A geothermal springs with naturally heated water that provide relaxation and medicinal benefits. Average temperature is 45°C.",
      "45°C"
    ],
    ["리온 is a mining town of 1234 people just nearby the gold mine.", "금 광산"],
    ["A wooden bridge spans over the 에린 River near 리온.", "목조 다리"],
    ["A big and famous roadside inn. Delicious roasted pork with sweet wine is served here.", "구운 돼지고기"],
    ["A lighthouse to serve as a beacon for ships in the open sea.", "등대"],
    ["A gorgeous waterfall flows here.", "폭포"],
    ["A historical battle of the 왕위 전쟁. \r\nDate: 12 봄.", "역사적인 전투"],
    ["Undiscovered dungeon.", "던전"],
    [
      "Locals say a relic monster of 10 m long inhabits 은빛 Lake. Truth or lie, folks are afraid to fish in the lake.",
      "10 m"
    ],
    [
      "Old sailors tell stories of a gigantic sea monster inhabiting these dangerous waters. Rumors say it can be 30 m long.",
      "30 m"
    ],
    ["Legends speak of a great Bearded Devil who inhabits 은빛 hills and terrorizes the region.", "수염 악마"],
    ["A sacred mountain of 은빛 신앙. Height: 1200 m.", "성산"],
    ["A forest sacred to local 은빛 신앙.", "신성하게"],
    ["A gang of forest bandits.", "도적"],
    ["Pirate ships have been spotted in these waters.", "해적선"],
    ["Ruins of an ancient city. Untold riches may lie within.", "고대 도시"],
    ["A vast collection of knowledge, including many rare and ancient tomes.", "고대 문헌"],
    ["Roll up, roll up, this magical circus is here for a limited time only.", "순회 서커스"],
    [
      "Warriors from around the land gather for a joust of might in 리온, with fame, fortune and favour on offer to the victor.",
      "리온"
    ],
    ["A fair is being held in 리온, with all manner of local and foreign goods and services on offer.", "장터"],
    [
      "A small location along the 은빛 River to launch boats from sits here, along with a weary looking owner, willing to sell passage along the river.",
      "나루터"
    ],
    [
      "A huge group of wolves are migrating, whether part of their annual routine, or something more extraordinary.",
      "늑대"
    ],
    [
      "A ball has been organised at 리온 as a chance to gather the nobility of the area together to be merry, make alliances and scheme around the crisis.",
      "귀족들"
    ],
    ["This distant mirage has been luring travellers out of their way for eons.", "신기루"],
    ["The 은빛 Glacial Cave. Locals claim that it is totally empty.", "완전히 비어"],
    [
      "An element of the magic portal system connecting major city. The portals were installed centuries ago, but still work fine.",
      "차원문"
    ],
    ["A rumoured demonic rift in this area is causing swarms of foes to spill forth.", "쏟아져"],
    ["A burial site has been disturbed in this area, causing the dead to rise and attack the living.", "무덤"],
    ["이 지역에서 인물을 만났습니다.", "인물"]
  ])("localizes generated prose: %s", (source, expected) => {
    const ko = translateMarkerText(source, "ko");
    expect(ko).toContain(expected);
    expect(ko).not.toMatch(/[A-Za-z]{2,}/);
  });

  it("localizes generated names while retaining proper-name prefixes", () => {
    expect(translateMarkerName("The Golden Bear", "ko")).toBe("황금 곰");
    expect(translateMarkerName("은빛 Glacial Cave", "ko")).toBe("은빛 빙하 동굴");
    expect(translateMarkerName("Hot Springs of 리온", "ko")).toBe("리온 온천");
  });
});
