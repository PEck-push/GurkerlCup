import type { CSSProperties } from 'react';

/** Gemeinsame Comic-/Cartoon-Stile (Outline statt Schlagschatten). */
export const COMIC_OUTLINE = '#0a1f12';
export const COMIC_CREAM = '#FDF6E3';

/** Dicke Outline-Schrift (Stroke hinter Füllung). */
export function chunky(size: number | string, fill: string, stroke = 7): CSSProperties {
  return {
    WebkitTextStroke: `${stroke}px ${COMIC_OUTLINE}`,
    paintOrder: 'stroke fill',
    color: fill,
    fontSize: size,
    lineHeight: 1,
  };
}

/** Dünne Outline für Namen/Fließtext. */
export const nameOutline: CSSProperties = {
  WebkitTextStroke: `3px ${COMIC_OUTLINE}`,
  paintOrder: 'stroke fill',
};
