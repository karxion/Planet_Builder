import { WorldSpaceStore } from "./model";
export const WorldSpaces = new WorldSpaceStore(() => window.dispatchEvent(new Event("project:changed")));
