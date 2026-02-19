# Scene Splitter — Idea Validation (AI Scene Generation → Asset Extraction)

## Executive summary + recommendation
**Concept:** Users describe a scene → AI generates a composed scene image → product automatically segments/splits it into **individual, game-ready assets** (transparent PNGs) plus **metadata** (bounds, tags, pivots/anchors, layering/order, suggested collisions, palette/style info).

**Recommendation:** **HOLD (validate wedge + feasibility before promoting).**
- The *pain* is real (especially **visual cohesion/consistency** and time spent producing/curating assets), and AI-assisted asset creation is clearly a trend.
- However, the market is **moderately saturated** on *generation* (Midjourney/Leonardo/Scenario/etc.) while the specific “**scene → auto-asset extraction**” workflow is less clearly proven and has **hard technical risk** (accurate segmentation, consistent style across extracted parts, clean alpha edges, usable pivots, and rights/licensing concerns depending on model/data).
- Strongest wedge is not “better art generation,” but “**turn one prompt into a coherent, editable asset kit** that drops into Unity/Godot/Aseprite workflows**.”

**Next step to promote to Active:** get 15–30 discovery calls (indie devs, designers) + build a prototype that reliably outputs **10–30 clean assets from one scene** for at least one constrained art style (e.g., flat vector, simple toon, or pixel-art-like with hard edges) and exports **engine-ready metadata**.

---

## Problem relevance (evidence + frequency score)
### What people complain about (patterns)
Across game-dev discussions, a recurring theme is that **asset production and/or asset integration is a bottleneck**, and that **consistency/cohesion** is hard when combining sources (packs, different artists, or iterative self-made assets).

Direct evidence from discoverable threads/snippets:
- **Incompatibility + lack of consistency from asset packs**:
  - r/gamedev thread snippet: “**assets you buy are not compatible, not consistent**…” (complaint about store-bought content and cohesion)  
    Source: https://www.reddit.com/r/gamedev/comments/1innxrh/storebought_content_is_bullshit/
- **Cohesion/consistency is the main risk when using purchased assets**:
  - Comment snippet: “**Visual cohesion** is the name of the game… you won’t be able to make a consistent product with different asset packs.”  
    Source: https://www.reddit.com/r/gamedev/comments/16u8mx6/bad_reputation_if_i_use_assets/
  - Thread snippet: “one of the hardest parts about store bought assets is **managing consistency**.”  
    Source: https://www.reddit.com/r/gamedev/comments/18jplme/store_bought_assets_bad/
- **Even self-made assets struggle with style consistency**:
  - r/gamedev thread snippet about 2D pixel-art avatars: “tricky to get a **perfectly consistent style**…”  
    Source: https://www.reddit.com/r/gamedev/comments/1ja6f20/gamedevs_that_create_their_own_assets_what_is_the/
- **AI generation still struggles with iterative art-direction / small edits across many assets** (older but still relevant framing):
  - “We don’t have the tools to make small adjustments without… retouching every asset…”  
    Source: https://www.reddit.com/r/gamedev/comments/x00s3h/so_i_think_its_a_complete_myth_that_ai_cant/

### Why this matters for Scene Splitter
Scene Splitter targets a specific pain chain:
1) People can generate images quickly (or buy packs), **but**
2) they still spend time **extracting/cleaning**, **naming**, **organizing**, and **making assets coherent** (style + technical integration).

The Reddit evidence above strongly supports the **consistency/cohesion** pain. It supports *asset workflow pain* indirectly (integration & fixes). It does not (from what we could fetch) strongly validate that users explicitly ask for “scene → automatic extraction,” but adjacent tooling demand exists (sprite/atlas splitting, slices, metadata export).

### Adjacent “splitting/export + metadata” demand (non-AI)
Existing workflows show repeated need to split/export pieces with metadata:
- **Aseprite Slices** explicitly supports exporting each slice as separate sprites and exporting slice data to JSON:
  - “You can export each slice as a different sprite using the **--split-slice** option.”  
    Source: https://www.aseprite.org/docs/slices/

This indicates: even without AI, developers value **turning a composition into separable parts + metadata**.

### Frequency score + trend direction
- **Frequency score (qualitative): HIGH** for “asset creation is hard/time-consuming” and “visual cohesion/consistency is hard,” based on multiple recurring Reddit discussions about store assets, style, and asset creation difficulty.
- **Trend direction: UP** (generative AI adoption is increasing; more teams experimenting with AI asset creation, which increases demand for *workflow/productionization* like organization, metadata, and consistency).

**Caveats:** Direct Reddit content could not be fetched due to blocking; quotes are from search snippets and thus should be re-verified by manual review.

---

## Market saturation & competitors (landscape + saturation score)
### Landscape
**1) General image generation (highly saturated):**
- **Midjourney** (strong aesthetics; weaker pipeline integration and structured outputs).
- **Leonardo.ai** (often positioned closer to production use; multiple asset-related features).

**2) Game-asset oriented AI generation (moderately saturated):**
- **Scenario** (focus on training custom models for consistent assets + API + asset mgmt).
  - Pricing page exists but is light on details in fetched content.  
    Source: https://www.scenario.com/pricing
  - Docs confirm usage-based pricing and that billing applies to **generating images or training**; supports dry-run cost estimation.
    Source: https://docs.scenario.com/page/api-pricing

**3) Asset splitting / extraction tools (non-AI; fragmented):**
- **PixAPT Atlas Splitter** (extract sprites from atlases / image cutting).  
  Source: https://www.pixapt.com/atlasSplit.html
- **Aseprite** slices / split-slice + JSON metadata export (manual slice authoring).  
  Source: https://www.aseprite.org/docs/slices/

### Saturation score
- **Generation:** **SATURATED**.
- **“Scene → asset extraction + metadata + engine export” workflow product:** **MODERATE / potentially underserved** (the workflow exists via manual tools, but the AI-native integrated pipeline is not a widely-known, dominant category).

### Competitive implication
To win, Scene Splitter must avoid competing head-on with “best image generator.” Instead, compete as a **pipeline tool**:
- “Turn a concept scene into a **cohesive asset kit** you can actually ship.”

---

## Differentiation opportunities (specific gaps)
Based on the pain patterns (cohesion + workflow) and incumbent positioning:

1) **Single-prompt → cohesive asset kit (consistency as a system, not just style training)**
- Incumbents generate images; consistency across *a pack* (many props/tiles/UI) remains hard without heavy prompting, control images, LoRAs, or custom training.
- Opportunity: a “**kit spec**” that locks palette, line weight, perspective, lighting, material rules, and naming.

2) **Automatic extraction with game-ready metadata**
- Not just transparent PNGs; include:
  - pivot/anchor suggestions (bottom-center for props, etc.)
  - layer order
  - bounding boxes
  - tags (prop type, biome, rarity)
  - optional physics/collision shapes (rough polygon)
  - export formats: Unity SpriteAtlas, Godot import presets, Aseprite JSON-like, TexturePacker JSON

3) **Editability + iteration loops**
- Key complaint with AI assets: small changes are painful and inconsistent.
- Differentiator: “**regenerate only this asset** in the kit while preserving style + constraints” (via per-asset seeds/control, reference embedding, or constrained diffusion/transform).

4) **Rights / training data provenance + team workflows**
- Scenario emphasizes enterprise/team workflows; you can differentiate with:
  - on-device / self-host option for studios
  - dataset provenance tooling
  - license tags attached to each asset

5) **Target a constrained style first (pixel-art, flat vector, or simple toon)**
- Segmentation/extraction quality improves dramatically when edges are simpler and the scene is composed for separation.

---

## Implementation suggestions
### Positioning
- **Not** “AI art generator.”
- **Yes:** “**Scene-to-kit pipeline** for game-ready assets.”
- Primary buyer: **indie devs** who ship 2D games (Unity/Godot), and designers making consistent packs.

### MVP scope (tight)
Aim for a usable vertical slice in ~4–8 weeks:
1) **Input:**
   - prompt + style preset (e.g., ‘flat vector’, ‘cozy toon’, ‘clean pixel-ish’)
   - optional: reference image + palette lock
2) **Generate:**
   - a composed scene image with “object separation hints” (clear silhouettes, spacing)
3) **Split:**
   - segmentation into 10–30 assets
   - output: transparent PNG per asset
4) **Metadata export:**
   - JSON containing: file name, bbox, pivot, category tag, source prompt, seed, layer order
5) **Batch regen:**
   - click an asset → “regenerate variants” while keeping the kit style

### Key technical bets / risks
- **Segmentation quality**: edges/holes, overlapping objects, shadows baked into background.
  - Mitigation: generate with explicit “separation mask” output (e.g., model also outputs ID map) rather than trying to segment a single RGB image.
- **Consistency across extracted assets**: make the generator output both the art and the ID map from the same latent.
- **Usability**: naming, pivots, and categories must be correct enough to reduce manual labor.

### Pricing & GTM hypothesis
- Sell as **workflow SaaS** priced per monthly credits + export features.
- Offer “**kit packs**”: e.g., 1 kit = 1 scene + N extracted assets + metadata.

### Validation experiments (fast)
- Landing page with 3 sample kits (scene + extracted PNG set + Unity/Godot import demo).
- Run a short survey in indie dev communities (Discords, forums) asking: “Would you pay $X to get a coherent pack from one prompt that imports cleanly?”
- Concierge MVP: manually generate scene + manually clean/split + deliver pack; measure time saved + willingness to pay.

---

## Sources (URLs)
- Reddit: store-bought assets consistency/incompatibility complaints (snippet-level due to fetch blocking)
  - https://www.reddit.com/r/gamedev/comments/1innxrh/storebought_content_is_bullshit/
  - https://www.reddit.com/r/gamedev/comments/16u8mx6/bad_reputation_if_i_use_assets/
  - https://www.reddit.com/r/gamedev/comments/18jplme/store_bought_assets_bad/
  - https://www.reddit.com/r/gamedev/comments/1ja6f20/gamedevs_that_create_their_own_assets_what_is_the/
  - https://www.reddit.com/r/gamedev/comments/x00s3h/so_i_think_its_a_complete_myth_that_ai_cant/

- Aseprite slices export + metadata concept
  - https://www.aseprite.org/docs/slices/

- Scenario pricing + API pricing docs
  - https://www.scenario.com/pricing
  - https://docs.scenario.com/page/api-pricing

- PixAPT atlas splitting (adjacent extraction tooling)
  - https://www.pixapt.com/atlasSplit.html
