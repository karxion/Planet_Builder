# Bilingual RPG Workspace

## Scope

- Header language selector: Korean (default) and English, persisted as a browser preference.
- Translate application chrome, main FMG menus, shared editor controls, tooltips, NPC rules and project messages. Keep world names, map labels, form values, notes and imported data unchanged.
- Use an explicit bilingual catalog with English fallback. Do not load Google Translate or send project content to translation services.
- Adapt legacy DOM labels without replacing elements, event handlers, option values or serialized SVG. Observe only changed UI subtrees and ignore map/canvas content.
- Preserve open settings and unsaved NPC form values when changing language. A language preference change must not mark the world dirty.

## Visual System

- Neutral charcoal surfaces, antique gold borders, emerald active controls and restrained crimson danger states.
- Serif display headings, readable Korean-compatible sans-serif controls, existing Fontello icons.
- Map remains the primary full-bleed workspace. No landing page or decorative content panels.
- Header exposes the map tools; matching styling extends to legacy menus and jQuery dialogs.
- Desktop header remains 58px. Small screens use a 100px two-row toolbar; viewport and globe height follow the actual header.
- Focus indicators, visible selected states, readable disabled controls, reduced-motion support and icon tooltips.

## Verification

- Unit tests for both translation directions, interpolation, fallback, punctuation and the catalog.
- Browser checks: Korean/English switching, persistence, legacy layers/style/tools, settings, NPC editing, cloud empty state, no horizontal overflow at 1440px, 1920px and 390px.
- Inspect actual screenshots and nonblank 3D canvas after responsive resizing.
- Type check, unit suite and production build. Existing cloud configuration is not changed.
