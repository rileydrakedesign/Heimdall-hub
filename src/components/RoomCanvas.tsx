"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text } from "pixi.js";
import { useRouter } from "next/navigation";

/**
 * RoomCanvas (MVP)
 * - Pixi canvas fills a fixed aspect area
 * - Placeholder "room" background
 * - Clickable hotspots that route to pages
 */
export default function RoomCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!hostRef.current) return;
    if (appRef.current) return;

    const app = new Application();
    appRef.current = app;

    let destroyed = false;

    (async () => {
      await app.init({
        backgroundAlpha: 0,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        resizeTo: hostRef.current!,
      });

      if (destroyed) return;
      hostRef.current!.appendChild(app.canvas);

      const stage = new Container();
      app.stage = stage;

      // Placeholder "room" background
      const bg = new Graphics();
      bg.rect(0, 0, app.screen.width, app.screen.height);
      bg.fill(0x0b1020);
      stage.addChild(bg);

      const title = new Text({
        text: "Riley Drake — Portfolio (Room MVP)",
        style: {
          fill: 0xe6e6e6,
          fontSize: 16,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        },
      });
      title.x = 16;
      title.y = 16;
      stage.addChild(title);

      // Hotspot helper
      const makeHotspot = (label: string, x: number, y: number, w: number, h: number, href: string) => {
        const g = new Graphics();
        g.rect(x, y, w, h);
        g.fill({ color: 0x1f2a44, alpha: 0.55 });
        g.stroke({ color: 0x7aa2ff, width: 2, alpha: 0.8 });
        g.eventMode = "static";
        g.cursor = "pointer";

        g.on("pointerenter", () => {
          g.alpha = 0.95;
        });
        g.on("pointerleave", () => {
          g.alpha = 1;
        });
        g.on("pointertap", () => {
          router.push(href);
        });

        const t = new Text({
          text: label,
          style: {
            fill: 0xe6e6e6,
            fontSize: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        });
        t.x = x + 10;
        t.y = y + 10;
        stage.addChild(g);
        stage.addChild(t);
      };

      // MVP hotspots (placeholder geometry)
      makeHotspot("Drawer → Work", 40, 120, 220, 90, "/work");
      makeHotspot("Mail → Contact", 300, 120, 220, 90, "/contact");
      makeHotspot("Poster → About", 560, 120, 220, 90, "/about");

      // Keep bg sized to canvas
      app.ticker.add(() => {
        bg.clear();
        bg.rect(0, 0, app.screen.width, app.screen.height);
        bg.fill(0x0b1020);
      });
    })();

    return () => {
      destroyed = true;
      try {
        app.destroy(true);
      } catch {
        // ignore
      }
      appRef.current = null;
    };
  }, [router]);

  return (
    <div className="w-full">
      <div className="w-full rounded-xl border border-white/10 bg-black/30 overflow-hidden">
        <div ref={hostRef} className="h-[560px] w-full" />
      </div>
      <p className="mt-3 text-sm text-white/70">
        MVP: click hotspots to navigate. Next: replace with Nano Banana isometric room assets + polygon hit areas.
      </p>
    </div>
  );
}
