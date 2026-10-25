export const TRANSPORT_STYLE_VERSION = "1";
export const TRANSPORT_STYLE_ATTRIBUTE = "data-fpb-transport-style";

export function getMapTransportStyle(preset = "default"): Record<string, Record<string, string | number>> {
  const dark = ["night", "cyberpunk", "darkSeas"].includes(preset);
  return {
    "#rivers": { fill: "#278fc4", opacity: 1 },
    "#roads": {
      stroke: dark ? "#e4c9a0" : "#87543b",
      "stroke-width": 1.1,
      "stroke-dasharray": "none",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: 0.95
    },
    "#trails": {
      stroke: dark ? "#c1ad91" : "#897564",
      "stroke-width": 0.35,
      "stroke-dasharray": "1 1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: 0.85
    }
  };
}
