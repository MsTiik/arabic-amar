"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Pen, RotateCcw } from "lucide-react";

/**
 * Animated demo of how an Arabic letter is drawn.
 *
 * Arabic handwriting doesn't have strict Chinese-style stroke ordering, but
 * naskh convention (per Dr. Mamoun Sakkal's widely-cited alphabet chart) is
 * consistent:
 *   1. Write from right to left.
 *   2. Draw the body of the letter first, in one or two pen-strokes.
 *   3. Add any dots, hamza seats, or extra marks last.
 *
 * We render the letter as SVG text and animate a clip rectangle from the
 * right edge of the glyph to the left — so the letter is "revealed" in the
 * same direction you'd draw it. That shows the most important thing a
 * beginner needs: which direction the pen moves. The dots-go-last
 * convention is communicated textually below the animation since we can't
 * cleanly separate body from dots across 30 letters without a hand-authored
 * stroke-path dataset (no free one exists).
 */

interface LetterStrokeDemoProps {
  /** The glyph to show — typically the isolated form of the letter. */
  glyph: string;
  /** Accessible label, e.g. "Show how to write bā'". */
  ariaLabel: string;
  /** Whether this letter has dots. If true we add the "dots go last" hint. */
  hasDots?: boolean;
}

const SWEEP_MS = 1500;

export function LetterStrokeDemo({ glyph, ariaLabel, hasDots }: LetterStrokeDemoProps) {
  const [open, setOpen] = useState(false);
  const [runId, setRunId] = useState(0);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setRunId((n) => n + 1);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-soft px-2.5 py-1 text-[11px] font-medium text-foreground-soft transition-colors hover:bg-muted focus-ring"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <Pen className="h-3 w-3" aria-hidden />
        {open ? "Hide stroke order" : "Show stroke order"}
      </button>

      {open ? (
        <div className="mt-3 rounded-xl border border-border bg-background p-3">
          <StrokeCanvas key={runId} glyph={glyph} />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">
              Pen moves right → left.
              {hasDots ? " In traditional handwriting, dots are added last." : ""}
            </p>
            <button
              type="button"
              onClick={() => setRunId((n) => n + 1)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground-soft transition-colors hover:bg-muted focus-ring"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Replay
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StrokeCanvas({ glyph }: { glyph: string }) {
  const clipId = useId();
  const rectRef = useRef<SVGRectElement | null>(null);

  useLayoutEffect(() => {
    // Use useLayoutEffect (not useEffect) so the initial translateX(200px)
    // is applied *before* the browser paints. Otherwise there's a one-frame
    // flash where the rect sits at its un-translated default (covering the
    // viewBox) and reveals the full glyph. StrokeCanvas only ever mounts
    // on the client after a user click, so there's no SSR mismatch risk.
    const rect = rectRef.current;
    if (!rect) return;
    // The rect is sized 200×160 at x=0. We translate it off-right
    // (translateX(200)) initially, then slide it back to translateX(0).
    // As it slides, the clip-path reveals the glyph in right-to-left order.
    const anim = rect.animate(
      [
        { transform: "translateX(200px)" },
        { transform: "translateX(0px)" },
      ],
      { duration: SWEEP_MS, easing: "ease-in-out", fill: "forwards" },
    );
    return () => {
      anim.cancel();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 200 160"
      className="block h-32 w-full"
      role="img"
      aria-label={`Stroke order for ${glyph}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect ref={rectRef} x="0" y="0" width="200" height="160" />
        </clipPath>
      </defs>

      {/* Faded outline of the full letter — the target shape. */}
      <text
        x="100"
        y="120"
        textAnchor="middle"
        className="fill-border"
        style={{
          fontFamily:
            "var(--font-arabic-display, 'Amiri Quran', 'Amiri', 'Scheherazade New', serif)",
          fontSize: "110px",
        }}
      >
        {glyph}
      </text>

      {/* Animated reveal: the fully-inked letter, clipped by the moving rect. */}
      <g clipPath={`url(#${clipId})`}>
        <text
          x="100"
          y="120"
          textAnchor="middle"
          className="fill-foreground"
          style={{
            fontFamily:
              "var(--font-arabic-display, 'Amiri Quran', 'Amiri', 'Scheherazade New', serif)",
            fontSize: "110px",
          }}
        >
          {glyph}
        </text>
      </g>

      {/* Direction indicator along the top. */}
      <g className="stroke-accent-gold fill-accent-gold" opacity="0.7">
        <line
          x1="180"
          y1="20"
          x2="28"
          y2="20"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <polygon points="22,20 32,15 32,25" />
      </g>
      <text
        x="100"
        y="14"
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: "9px", fontFamily: "system-ui" }}
      >
        write right → left
      </text>
    </svg>
  );
}
