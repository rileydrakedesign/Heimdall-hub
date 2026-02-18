#!/usr/bin/env python3
"""Isometric pixel-art pipeline (Nano Banana Pro)

Workflow (intended):
1) Generate a main scene (establishing shot)
2) User approval gate: request regenerate/changes + classify assets
3) Generate a BASE PLATE from the scene: background + static elements only
4) Generate dynamic/non-static assets one-by-one as standalone cutouts

This script shells out to OpenClaw nano-banana-pro generator:
  /home/claw/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py

Run with:
  uv run ./scripts/iso_pixel.py ...

Note: "base plate" is done via image-to-image editing instructions. Results depend on prompt strength.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import shlex
import subprocess
from pathlib import Path

from PIL import Image

NANO_BANANA_GENERATOR = Path(
    "/home/claw/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py"
)

DEFAULT_RESOLUTION = "1K"


def ts() -> str:
    return dt.datetime.utcnow().strftime("%Y-%m-%d-%H-%M-%S")


def run(cmd: list[str]) -> None:
    print("$ " + " ".join(shlex.quote(c) for c in cmd), flush=True)
    subprocess.check_call(cmd)


def scene_prompt(scene: str, *, angle: str, style: str) -> str:
    return "\n".join(
        [
            "Isometric pixel art diorama scene.",
            f"Scene: {scene}.",
            f"Perspective: {angle}.",
            f"Style: {style}.",
            "Constraints: crisp pixel edges, avoid anti-aliasing, no text, no watermark, no logo.",
            "Lighting: soft ambient, readable silhouettes.",
            "Composition: 3/4 top-down isometric view, clear object separation, game-ready layout.",
        ]
    )


def base_plate_prompt(
    *,
    angle: str,
    style: str,
    keep_notes: str,
    remove_list: list[str],
) -> str:
    remove_clause = (
        "Remove the following non-static/movable elements entirely: "
        + ", ".join(remove_list)
        + "."
        if remove_list
        else "Remove any characters and any loose movable items that should be separate assets."
    )

    return "\n".join(
        [
            "Edit the input image to create a BASE PLATE (background) for an isometric pixel-art scene.",
            f"Keep: {keep_notes}",
            remove_clause,
            "Do NOT change camera angle, perspective, palette, or pixel style.",
            f"Perspective: {angle}.",
            f"Style: {style}.",
            "Constraints: crisp pixel edges, avoid anti-aliasing, no text, no watermark, no logo.",
            "Output: a clean scene background plate suitable for layering dynamic sprite assets on top.",
        ]
    )


def asset_prompt(
    asset_name: str,
    asset_desc: str,
    *,
    angle: str,
    style: str,
) -> str:
    # NOTE: This is "re-render" mode. It can drift.
    return "\n".join(
        [
            "Use the input image strictly as style + palette + isometric orientation reference.",
            "Generate ONE standalone pixel-art asset.",
            f"Asset: {asset_name}.",
            f"Details: {asset_desc}.",
            f"Perspective: {angle}.",
            f"Style: {style}.",
            "Framing: center the object, make it large (fills most of the frame) but fully contained.",
            "Background: pure solid white (#FFFFFF), no gradient, no texture, no vignette.",
            "Constraints: no text, no watermark, no logo, no extra objects.",
        ]
    )


def isolate_prompt(
    asset_name: str,
    *,
    style: str,
    keep: list[str] | None = None,
    remove: list[str] | None = None,
) -> str:
    # First pass: isolate the subject and delete nearby/overlapping clutter.
    keep_clause = (
        "Keep ONLY: " + ", ".join(keep) + "." if keep else f"Keep ONLY the {asset_name}."
    )
    remove_clause = (
        "Remove completely: " + ", ".join(remove) + "." if remove else "Remove everything else."
    )

    return "\n".join(
        [
            "Edit the input image with MINIMAL changes.",
            f"Target asset: {asset_name}.",
            keep_clause,
            remove_clause,
            "If any removed object overlaps the target asset, reconstruct the hidden pixels of the target asset in the SAME pixel style.",
            "Do NOT redesign the target asset. Keep its exact shape, proportions, colors, shading ramps, and pixel clusters.",
            f"Preserve pixel rendering style: {style}.",
            "Background must be pure solid white (#FFFFFF).",
            "No extra objects, no text, no watermark, no logo.",
        ]
    )


def load_spec(path: str) -> dict:
    return json.loads(Path(path).read_text())


def spec_angle_style(spec: dict, args: argparse.Namespace) -> tuple[str, str]:
    angle = spec.get("angle") or args.angle
    style = spec.get("style") or args.style
    return angle, style


def cmd_scene(args: argparse.Namespace) -> None:
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    filename = outdir / f"{ts()}-scene-{args.slug}.png"
    prompt = scene_prompt(args.scene, angle=args.angle, style=args.style)

    run(
        [
            "uv",
            "run",
            str(NANO_BANANA_GENERATOR),
            "--prompt",
            prompt,
            "--filename",
            str(filename),
            "--resolution",
            args.resolution,
        ]
    )


def remove_by_reference_prompt(
    *,
    angle: str,
    style: str,
    keep_notes: str,
    asset_name: str,
    roi_hint: str | None = None,
    swatch_count: int = 0,
) -> str:
    lines = [
        "You will receive multiple input images.",
        "Image 1: the current isometric pixel-art room scene to edit (this is the one to modify).",
        "Image 2: a standalone asset cutout on white; use it as an EXACT visual reference for what to remove.",
    ]
    if swatch_count:
        lines.append(
            f"Images 3-{2+swatch_count}: small background texture swatches from the same scene. Use them to reconstruct the background behind the removed object."
        )

    lines += [
        "Task: remove the object from Image 2 from the scene in Image 1.",
        f"Remove target: {asset_name}.",
        f"Keep: {keep_notes}",
        "Guardrails (critical):",
        "- ONLY change pixels where the target object exists. Everywhere else must remain pixel-identical.",
        "- Keep camera angle/perspective/composition identical.",
        "- Keep palette/materials/pixel clusters identical.",
        "- Do NOT redesign any remaining objects.",
        "- Remove the target completely; reconstruct the background behind it (best-guess) in the same pixel style.",
        "- Prefer minor artifacts over changing nearby objects.",
        "- Do not remove static props unless they are part of the target.",
    ]
    if roi_hint:
        lines.append(f"Editing region hint: {roi_hint}")

    lines += [
        f"Perspective: {angle}.",
        f"Style: {style}.",
        "No text, no watermark, no logo.",
    ]
    return "\n".join(lines)


def find_latest_asset(outdir: Path, asset_id: str) -> Path | None:
    # Expect files named like: *-asset-<id>.png
    matches = list(outdir.glob(f"*-asset-{asset_id}.png"))
    if not matches:
        return None
    matches.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return matches[0]


def locate_asset_in_scene(scene_path: Path, asset_path: Path) -> tuple[int, int, int, int] | None:
    """Approximate asset bbox in the scene via coarse template matching.

    We downscale aggressively and do a masked MSE match. This is a guardrail helper
    (and good enough to estimate a "do not edit outside here" region).
    """
    import numpy as np

    scene = Image.open(scene_path).convert("RGB")
    asset = Image.open(asset_path).convert("RGB")

    # Trim asset to its main foreground region first to get a tight template.
    bb = bbox_foreground(asset)
    if not bb:
        return None
    ax0, ay0, ax1, ay1 = bb
    asset_t = asset.crop((ax0, ay0, ax1, ay1))

    # Downscale to keep brute-force tractable.
    scale = 0.125
    sw, sh = scene.size
    aw, ah = asset_t.size
    s2 = scene.resize((max(1, int(sw * scale)), max(1, int(sh * scale))), resample=Image.NEAREST)
    a2 = asset_t.resize((max(1, int(aw * scale)), max(1, int(ah * scale))), resample=Image.NEAREST)

    S = np.asarray(s2, dtype=np.int16)
    A = np.asarray(a2, dtype=np.int16)
    H, W, _ = S.shape
    h, w, _ = A.shape
    if h >= H or w >= W:
        return None

    # Mask: ignore near-background pixels in the asset template.
    bb2 = bbox_foreground(a2)
    if not bb2:
        return None
    mx0, my0, mx1, my1 = bb2
    mask = np.zeros((h, w), dtype=bool)
    mask[my0:my1, mx0:mx1] = True

    best = None
    best_score = None
    step = 2
    for y in range(0, H - h, step):
        for x in range(0, W - w, step):
            patch = S[y : y + h, x : x + w, :]
            d = patch - A
            # masked MSE
            mse = (d[:, :, 0] ** 2 + d[:, :, 1] ** 2 + d[:, :, 2] ** 2)[mask].mean()
            if best_score is None or mse < best_score:
                best_score = mse
                best = (x, y)

    if best is None:
        return None

    bx, by = best
    # Map back to original scene coords.
    x0 = int(round(bx / scale))
    y0 = int(round(by / scale))
    x1 = int(round((bx + w) / scale))
    y1 = int(round((by + h) / scale))
    return (x0, y0, x1, y1)


def drift_outside_roi(prev_path: Path, next_path: Path, roi: tuple[int, int, int, int], *, delta: int = 18) -> float:
    """Return fraction of changed pixels outside ROI."""
    import numpy as np

    prev = np.asarray(Image.open(prev_path).convert("RGB"), dtype=np.int16)
    nxt = np.asarray(Image.open(next_path).convert("RGB"), dtype=np.int16)
    if prev.shape != nxt.shape:
        return 1.0

    diff = np.abs(nxt - prev).sum(axis=2)
    changed = diff > delta

    x0, y0, x1, y1 = roi
    x0 = max(0, x0)
    y0 = max(0, y0)
    x1 = min(prev.shape[1], x1)
    y1 = min(prev.shape[0], y1)

    mask_roi = np.zeros(changed.shape, dtype=bool)
    mask_roi[y0:y1, x0:x1] = True

    outside = changed & (~mask_roi)
    return float(outside.mean())


def background_swatches(scene_path: Path, roi: tuple[int, int, int, int], outdir: Path, *, size: int = 96) -> list[Path]:
    """Crop a few background swatches near, but outside, the ROI."""
    im = Image.open(scene_path).convert("RGB")
    W, H = im.size
    x0, y0, x1, y1 = roi
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2

    def crop_at(px: int, py: int, tag: str) -> Path | None:
        half = size // 2
        lx = max(0, min(W - size, px - half))
        ty = max(0, min(H - size, py - half))
        if lx < 0 or ty < 0:
            return None
        fp = outdir / f"{ts()}-swatch-{tag}.png"
        im.crop((lx, ty, lx + size, ty + size)).save(fp)
        return fp

    candidates = [
        crop_at(cx, max(0, y0 - size), "top"),
        crop_at(cx, min(H - 1, y1 + size), "bottom"),
        crop_at(max(0, x0 - size), cy, "left"),
        crop_at(min(W - 1, x1 + size), cy, "right"),
    ]
    return [c for c in candidates if c is not None]


def cmd_base(args: argparse.Namespace) -> None:
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    scene_image = Path(args.scene_image)
    if not scene_image.exists():
        raise SystemExit(f"Scene image not found: {scene_image}")

    spec = load_spec(args.spec_json) if args.spec_json else {}
    angle, style = spec_angle_style(spec, args)

    keep_notes = (
        (spec.get("base") or {}).get("background_notes")
        or args.keep
        or "the environment, architecture, and all static background elements"
    )

    filename = outdir / f"{ts()}-base-{args.slug}.png"

    if args.mode == "byref":
        # Remove dynamic assets one-by-one using their extracted cutouts as references.
        dyn = ((spec.get("assets") or {}).get("dynamic")) if spec else None
        if not isinstance(dyn, list) or not dyn:
            raise SystemExit("spec-json must include assets.dynamic[] for base --mode byref")

        current = scene_image
        for a in dyn:
            if not isinstance(a, dict):
                continue
            asset_id = a.get("id") or a.get("name")
            asset_name = a.get("name") or asset_id
            if not asset_id:
                continue

            asset_img = find_latest_asset(outdir, str(asset_id))
            if not asset_img:
                raise SystemExit(
                    f"Missing extracted asset image for '{asset_id}' in outdir. Generate it first (assets --mode extract)."
                )

            # Locate asset in the current scene (approx) to provide a region hint + swatches.
            roi = locate_asset_in_scene(current, asset_img) or (0, 0, 0, 0)
            if roi != (0, 0, 0, 0):
                x0, y0, x1, y1 = roi
                roi_hint = (
                    f"Target appears approximately in this rectangle: x={x0}-{x1}, y={y0}-{y1} (pixels). Do not edit outside it."
                )
            else:
                roi_hint = None

            swatches = background_swatches(current, roi, outdir) if roi_hint else []

            # Retry loop: if we drift outside ROI, escalate prompt and retry.
            retries = int(getattr(args, "max_retries", 2) or 2)
            last_out = None
            for attempt in range(retries + 1):
                step_out = outdir / f"{ts()}-base-step-remove-{asset_id}-a{attempt}.png"
                prompt = remove_by_reference_prompt(
                    angle=angle,
                    style=style,
                    keep_notes=str(keep_notes),
                    asset_name=str(asset_name),
                    roi_hint=roi_hint,
                    swatch_count=len(swatches),
                )
                if attempt > 0:
                    prompt += (
                        "\n\nESCALATION: You changed pixels outside the target region. Retry and keep EVERYTHING outside the region EXACTLY identical."
                    )

                cmd = [
                    "uv",
                    "run",
                    str(NANO_BANANA_GENERATOR),
                    "--prompt",
                    prompt,
                    "--filename",
                    str(step_out),
                    "--resolution",
                    args.resolution,
                    "-i",
                    str(current),
                    "-i",
                    str(asset_img),
                ]
                for s in swatches:
                    cmd += ["-i", str(s)]
                run(cmd)

                last_out = step_out

                if roi_hint:
                    # Expand ROI a bit for tolerance.
                    x0, y0, x1, y1 = roi
                    pad = 24
                    roi_pad = (x0 - pad, y0 - pad, x1 + pad, y1 + pad)
                    outside = drift_outside_roi(current, step_out, roi_pad)
                    if outside > 0.005:
                        continue

                # Good enough.
                break

            if not last_out:
                raise SystemExit("Base step failed unexpectedly")

            current = last_out
        # Final base plate is the last step output.
        current.replace(filename)
        print(f"Base plate saved: {filename}")
        return

    # Default/simple mode: remove by name list.
    remove_list: list[str] = []
    dyn = ((spec.get("assets") or {}).get("dynamic")) if spec else None
    if isinstance(dyn, list):
        for a in dyn:
            if isinstance(a, dict) and a.get("name"):
                remove_list.append(str(a["name"]))

    prompt = base_plate_prompt(
        angle=angle,
        style=style,
        keep_notes=str(keep_notes),
        remove_list=remove_list,
    )

    run(
        [
            "uv",
            "run",
            str(NANO_BANANA_GENERATOR),
            "--prompt",
            prompt,
            "--filename",
            str(filename),
            "--resolution",
            args.resolution,
            "-i",
            str(scene_image),
        ]
    )


def iter_assets(spec: dict, *, kind: str) -> list[dict]:
    assets = ((spec.get("assets") or {}).get(kind))
    if not isinstance(assets, list):
        return []
    out: list[dict] = []
    for a in assets:
        if isinstance(a, dict):
            out.append(a)
    return out


def crop_image(src: Path, bbox: list[int], dst: Path) -> None:
    if len(bbox) != 4:
        raise SystemExit("bbox must be [x,y,w,h]")
    x, y, w, h = (int(v) for v in bbox)
    if w <= 0 or h <= 0:
        raise SystemExit("bbox w/h must be > 0")

    im = Image.open(src).convert("RGBA")
    cropped = im.crop((x, y, x + w, y + h))
    dst.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(dst)


def bbox_foreground(im: Image.Image, *, eps: int = 8) -> tuple[int, int, int, int] | None:
    """Return a robust bbox of the *main* foreground region.

    Backgrounds from Nano Banana edits are usually "mostly white" but may contain tiny
    specks/compression noise. A naive bbox over *all* non-background pixels can balloon
    to the whole canvas.

    Strategy:
    1) Estimate background RGB from the border (median).
    2) Build a foreground mask by RGB distance > eps.
    3) Compute row/col densities and take the largest contiguous dense segment.

    This reliably crops the primary asset while ignoring sparse specks.
    """
    import numpy as np

    rgb = np.array(im.convert("RGB"), dtype=np.int16)
    h, w, _ = rgb.shape

    border = np.concatenate(
        [rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]], axis=0
    )
    bg = np.median(border, axis=0)

    diff = np.abs(rgb - bg)
    mask = (diff[:, :, 0] + diff[:, :, 1] + diff[:, :, 2]) > eps
    if not mask.any():
        return None

    row = mask.sum(axis=1)
    col = mask.sum(axis=0)

    # Require a small % density to ignore isolated specks.
    row_thr = max(int(0.02 * w), 10)
    col_thr = max(int(0.02 * h), 10)

    rows = np.where(row > row_thr)[0]
    cols = np.where(col > col_thr)[0]
    if len(rows) == 0 or len(cols) == 0:
        # Fallback to naive bbox if density heuristic fails.
        ys, xs = np.where(mask)
        return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)

    def largest_segment(idxs: np.ndarray) -> tuple[int, int]:
        idxs = np.sort(idxs)
        start = prev = int(idxs[0])
        best = (start, prev)
        for v in idxs[1:]:
            v = int(v)
            if v == prev + 1:
                prev = v
            else:
                if (prev - start) > (best[1] - best[0]):
                    best = (start, prev)
                start = prev = v
        if (prev - start) > (best[1] - best[0]):
            best = (start, prev)
        return best

    y0, y1 = largest_segment(rows)
    x0, x1 = largest_segment(cols)

    return (int(x0), int(y0), int(x1) + 1, int(y1) + 1)


def trim_to_asset(
    src: Path,
    dst: Path,
    *,
    margin_px: int = 6,
) -> None:
    """Tight-crop an asset on white by finding the non-white bbox."""
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    bb = bbox_foreground(im)
    if not bb:
        raise SystemExit(f"Could not find non-white pixels to trim in: {src}")

    x0, y0, x1, y1 = bb
    x0 = max(0, x0 - margin_px)
    y0 = max(0, y0 - margin_px)
    x1 = min(w, x1 + margin_px)
    y1 = min(h, y1 + margin_px)

    crop = im.crop((x0, y0, x1, y1))
    dst.parent.mkdir(parents=True, exist_ok=True)
    crop.convert("RGB").save(dst)


def center_asset_on_white(
    src: Path,
    dst: Path,
    *,
    canvas_size: tuple[int, int] = (1024, 1024),
    target_fill: float = 0.90,
    margin_px: int = 6,
    bg: tuple[int, int, int, int] = (255, 255, 255, 255),
) -> None:
    """Center and zoom an extracted asset deterministically.

    Uses a NEW canvas (default 1024x1024) to guarantee centering regardless of original crop offset.
    """
    im = Image.open(src).convert("RGBA")
    bb = bbox_foreground(im)
    if not bb:
        raise SystemExit(f"Could not find non-white pixels to center in: {src}")

    x0, y0, x1, y1 = bb
    x0 = max(0, x0 - margin_px)
    y0 = max(0, y0 - margin_px)
    x1 = min(im.size[0], x1 + margin_px)
    y1 = min(im.size[1], y1 + margin_px)

    crop = im.crop((x0, y0, x1, y1))
    cw, ch = crop.size

    W, H = canvas_size
    scale = min((W * target_fill) / cw, (H * target_fill) / ch)
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    crop = crop.resize((nw, nh), resample=Image.NEAREST)

    canvas = Image.new("RGBA", (W, H), bg)
    ox = (W - nw) // 2
    oy = (H - nh) // 2
    canvas.alpha_composite(crop, (ox, oy))

    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(dst)


def cmd_assets(args: argparse.Namespace) -> None:
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    ref_image = Path(args.ref_image)
    if not ref_image.exists():
        raise SystemExit(f"Reference image not found: {ref_image}")

    spec = load_spec(args.spec_json)
    angle, style = spec_angle_style(spec, args)

    assets = iter_assets(spec, kind=args.kind)
    if not assets:
        raise SystemExit(f"No assets found for kind='{args.kind}' in spec")

    # Optional filtering for sequential generation.
    if args.only_id:
        assets = [a for a in assets if str(a.get("id")) == args.only_id]
        if not assets:
            raise SystemExit(f"Asset id not found: {args.only_id}")

    for a in assets:
        asset_id = a.get("id") or a.get("name") or "asset"
        name = a.get("name") or asset_id
        desc = a.get("description") or ""

        mode = args.mode
        extract_cfg = a.get("extract") if isinstance(a.get("extract"), dict) else None

        if mode == "extract":
            if not extract_cfg or not isinstance(extract_cfg.get("bbox"), list):
                raise SystemExit(
                    f"Asset '{asset_id}' missing extract.bbox; set [x,y,w,h] in spec to use extract mode"
                )

            crop_path = outdir / f"{ts()}-crop-{asset_id}.png"
            crop_image(ref_image, extract_cfg["bbox"], crop_path)

            # Pass 1: isolate target asset on white.
            isolate_out = outdir / f"{ts()}-isolated-{asset_id}.png"
            keep = extract_cfg.get("keep") if isinstance(extract_cfg.get("keep"), list) else None
            remove = extract_cfg.get("remove") if isinstance(extract_cfg.get("remove"), list) else None
            prompt = isolate_prompt(str(name), style=style, keep=keep, remove=remove)

            run(
                [
                    "uv",
                    "run",
                    str(NANO_BANANA_GENERATOR),
                    "--prompt",
                    prompt,
                    "--filename",
                    str(isolate_out),
                    "--resolution",
                    args.resolution,
                    "-i",
                    str(crop_path),
                ]
            )

            # Pass 2: deterministic centering on white (no model drift).
            filename = outdir / f"{ts()}-asset-{asset_id}.png"
            center_cfg = extract_cfg.get("center") if isinstance(extract_cfg.get("center"), dict) else {}
            target_fill = float(center_cfg.get("targetFill") or 0.90)
            enabled = center_cfg.get("enabled", True)
            trim_only = bool(center_cfg.get("trimOnly", False))
            canvas = center_cfg.get("canvas") if isinstance(center_cfg.get("canvas"), list) else None
            canvas_size = (
                (int(canvas[0]), int(canvas[1])) if canvas and len(canvas) == 2 else (1024, 1024)
            )

            if trim_only:
                trim_to_asset(isolate_out, filename)
                print(f"Trimmed asset saved: {filename}")
            elif enabled:
                center_asset_on_white(
                    isolate_out,
                    filename,
                    target_fill=target_fill,
                    canvas_size=canvas_size,
                )
                print(f"Centered asset saved: {filename}")
            else:
                isolate_out.replace(filename)
        else:
            # "render" mode (can drift)
            filename = outdir / f"{ts()}-asset-{asset_id}.png"
            prompt = asset_prompt(str(name), str(desc), angle=angle, style=style)

            run(
                [
                    "uv",
                    "run",
                    str(NANO_BANANA_GENERATOR),
                    "--prompt",
                    prompt,
                    "--filename",
                    str(filename),
                    "--resolution",
                    args.resolution,
                    "-i",
                    str(ref_image),
                ]
            )


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--outdir", required=True)
    common.add_argument("--resolution", default=DEFAULT_RESOLUTION, choices=["1K", "2K", "4K"])
    common.add_argument(
        "--angle",
        default="2:1 isometric, 30-degree view",
        help="Perspective/orientation constraint",
    )
    common.add_argument(
        "--style",
        default="16-bit pixel art, crisp edges, limited palette, subtle dithering",
        help="Style constraint",
    )
    common.add_argument("--slug", default="scene", help="Filename slug")

    ps = sub.add_parser("scene", parents=[common])
    ps.add_argument("--scene", required=True, help="High-level scene description")
    ps.set_defaults(func=cmd_scene)

    pb = sub.add_parser("base", parents=[common])
    pb.add_argument("--scene-image", required=True, help="Approved main scene image")
    pb.add_argument("--spec-json", help="Optional spec JSON; dynamic asset names used as removal hints")
    pb.add_argument("--keep", help="Optional keep-notes override")
    pb.add_argument(
        "--mode",
        choices=["simple", "byref"],
        default="simple",
        help="simple=remove by text list; byref=remove dynamic assets one-by-one using extracted asset images as references",
    )
    pb.add_argument(
        "--max-retries",
        type=int,
        default=2,
        help="Retries per removal step if drift guardrail triggers (byref mode)",
    )
    pb.set_defaults(func=cmd_base)

    pa = sub.add_parser("assets", parents=[common])
    pa.add_argument("--ref-image", required=True, help="Reference image (usually the approved scene)")
    pa.add_argument("--spec-json", required=True)
    pa.add_argument("--kind", choices=["static", "dynamic"], default="dynamic")
    pa.add_argument("--only-id", help="Generate a single asset id (sequential workflow)")
    pa.add_argument(
        "--mode",
        choices=["render", "extract"],
        default="render",
        help="render=recreate from prompt (may drift); extract=crop from approved scene and edit background to white for max fidelity",
    )
    pa.set_defaults(func=cmd_assets)

    return p


def main() -> None:
    if not os.environ.get("GEMINI_API_KEY"):
        raise SystemExit("GEMINI_API_KEY not set")
    p = build_parser()
    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
