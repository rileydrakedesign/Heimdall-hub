---
name: isometric-pixel-nano-banana
description: Scene → base plate → sequential assets for consistent isometric pixel art (Nano Banana Pro).
metadata:
  {
    "openclaw": {
      "requires": { "bins": ["uv"], "env": ["GEMINI_API_KEY"] }
    }
  }
---

# Isometric Pixel Art (Nano Banana Pro)

This skill scaffolds a **three-stage workflow**:

1) **Scene generation** (establishing shot)
2) **Base plate generation** (background + static elements only)
3) **Sequential asset generation** (dynamic/non-static assets), using the approved scene as the **style+orientation reference**

## Why the extra “base plate” step?
It separates what’s baked into the background from what you’ll place/animate later.

## Commands

### Generate a scene

```bash
uv run ./scripts/iso_pixel.py scene \
  --scene "Cozy cyberpunk ramen stall on a floating platform" \
  --slug ramen-stall \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

### Generate a base plate (from an approved scene)

```bash
uv run ./scripts/iso_pixel.py base \
  --scene-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --slug ramen-stall \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

### Generate dynamic assets (sequentially)

```bash
uv run ./scripts/iso_pixel.py assets \
  --ref-image ../../out/iso-pixel/<approved-scene>.png \
  --spec-json ./examples/spec.ramen-stall.json \
  --kind dynamic \
  --only-id lantern_neon \
  --outdir ../../out/iso-pixel \
  --resolution 1K
```

## Asset image contract
Each asset image should:
- be **one object only**
- be **centered** and fill most of the frame while fully contained
- have **pure white** background (`#FFFFFF`)
- match the scene’s **pixel style** and **isometric angle**
- contain **no text/watermarks/logos**

## Prompting strategy
- Scene: strongly constrained isometric pixel prompt.
- Base plate: image edit prompt that preserves camera/style and removes dynamic elements.
- Assets: image generation with the scene image as a reference; prompts define the role of the reference explicitly.
