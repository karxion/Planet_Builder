# Generated modular scene assets

These PNGs were generated with the image generation tool for this project. They are individual reusable parts, not finished town or battle-map background images.

Each PNG contains the same object twice: a bird's-eye projection in its left half and a tactical top-down projection in its right half. `src/data/scene-image-manifest.json` records original dimensions, PNG SHA-256 and the small viewport inset used to exclude bleed from the neighboring sprite. Files are copied unchanged from generation output, retaining original alpha transparency. No world-map token or third-party game artwork is used.

| File | Part |
| --- | --- |
| house.png | Cottage/building |
| keep.png | Fortified hall with tower |
| wall.png | Chainable wall segment |
| gate.png | Gatehouse |
| well.png | Well |
| barn.png | Barn and attached pen |
| paving.png | Paving tile |
| tree.png | Tree |

The renderer assembles these pieces on generated plots, chains walls, places gates/well/trees and repeats paving. The tactical image is a schematic playable map; illustrated wall/door pixels do not implement movement/pathfinding rules. Exports embed the original PNG bytes so maps remain portable.
