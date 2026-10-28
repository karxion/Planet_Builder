import Alea from "alea";
import { getGenerationLanguage, type GenerationLanguage } from "@/services/generation-language";

const parts = [
  [
    ["아르", "Ar"],
    ["엘", "El"],
    ["벨", "Vel"],
    ["에르", "Er"],
    ["루", "Lu"],
    ["세", "Se"],
    ["오르", "Or"],
    ["카", "Ka"],
    ["네", "Ne"],
    ["이", "I"],
    ["테", "Te"],
    ["에일", "Ael"]
  ],
  [
    ["라", "la"],
    ["디", "di"],
    ["베", "ve"],
    ["레", "re"],
    ["노", "no"],
    ["미", "mi"],
    ["세", "se"],
    ["다", "da"],
    ["메", "me"],
    ["리", "ri"],
    ["도", "do"],
    ["나", "na"]
  ],
  [
    ["리아", "ria"],
    ["니아", "nia"],
    ["온", "on"],
    ["테라", "terra"],
    ["도르", "dor"],
    ["하임", "heim"],
    ["엘", "el"],
    ["리스", "lis"],
    ["아라", "ara"],
    ["엔", "en"],
    ["움", "um"],
    ["아스", "as"]
  ]
] as const;

/** Independent seeded vocabulary: does not consume the terrain generator's RNG. */
export function generateRealmName(seed: string, language: GenerationLanguage = getGenerationLanguage()): string {
  const rng = Alea(`realm-name:${seed}`);
  return parts.map(group => group[Math.floor(rng() * group.length)][language === "ko" ? 0 : 1]).join("");
}

export function isDefaultRealmName(name: string): boolean {
  return ["", "새로운 판타지 행성", "New fantasy planet"].includes(name.trim());
}
