# Isometric Pixel Art (Nano Banana Pro)

A **scene → base plate → assets** pipeline for consistent isometric pixel art.

## Workflow

1) **Main scene (establishing shot)**
   - Generates the overall look (palette, rendering style, isometric angle).
   - This is the anchor reference for everything else.

2) **Approval gate (human-in-the-loop)**
   - You review the scene.
   - You can request regeneration/changes.
   - You decide which elements are **static** (baked into the background/base plate) vs **dynamic** (generated as standalone assets).

3) **Base plate generation**
   - An edited version of the approved scene that keeps background + static props.
   - Removes dynamic elements (characters, loose items, etc.) so you can layer them later.

4) **Dynamic assets generated sequentially**
   - One asset at a time.
   - For *maximum fidelity*, use **extract mode**: crop the object out of the approved scene and run an **edit** that replaces the background with pure white while keeping the object’s pixel design identical.
   - Each asset image is a standalone cutout on **pure white**.

## Commands

### 1) Generate a scene

```bash
uv run ./scripts/iso_pixel.py scene \
  --scene "Cozy cyberpunk ramen stall on a floating platform" \
  --slug ramen-stall \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

### 2) Create a spec (static vs dynamic)

Edit `./examples/spec.ramen-stall.json` (or copy it) and list your assets under:
- `assets.static[]`
- `assets.dynamic[]`

### 3) Generate a base plate from the approved scene

Simple mode (remove by name list):
```bash
uv run ./scripts/iso_pixel.py base \
  --scene-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --mode simple \
  --slug ramen-stall \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

Robust mode (**recommended**) — remove dynamic assets one-by-one using their extracted cutouts as references, with guardrails:
```bash
# First, extract all dynamic assets to outdir (assets --mode extract)
uv run ./scripts/iso_pixel.py base \
  --scene-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --mode byref \
  --max-retries 2 \
  --slug ramen-stall \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

Guardrails used in byref mode:
- Approximate target location via coarse template matching (non-OpenCV) to produce a **"do not edit outside"** region hint.
- Auto-crop a few **background texture swatches** near the target region and provide them as extra references.
- CV drift check: if too many pixels changed outside the target region, retry with a stricter prompt (up to --max-retries).

### 4) Generate dynamic assets (one-by-one)

All dynamic assets:
```bash
uv run ./scripts/iso_pixel.py assets \
  --ref-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --kind dynamic \
  --outdir ../../out/iso-pixel
```

Single asset (sequential workflow):
```bash
uv run ./scripts/iso_pixel.py assets \
  --ref-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --kind dynamic \
  --only-id lantern_neon \
  --outdir ../../out/iso-pixel
```

Single asset (max-consistency **extract** mode; requires `extract.bbox` in spec):
```bash
uv run ./scripts/iso_pixel.py assets \
  --ref-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --kind dynamic \
  --only-id lantern_neon \
  --mode extract \
  --outdir ../../out/iso-pixel
```

## Asset image contract
Each standalone asset image should:
- be **one object only** (no extra props)
- be **centered** and fill most of the frame while fully contained
- have **pure white** background (`#FFFFFF`)
- match the scene’s **pixel style** and **isometric angle**
- contain **no text/watermarks/logos**

## Robust centering/cropping (important)
After Nano Banana isolation, backgrounds can contain tiny compression specks.
The skill uses a **robust CV-style crop** (border-median background estimate + row/col density) to find the true asset bbox, then optionally scales and centers it on a fixed canvas.
This avoids “bbox balloons to full canvas” failures.
