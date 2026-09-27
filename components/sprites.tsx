// Hand-drawn pixel sprites. Each row is a string; each char maps to a colour.
// "." is transparent. Rendered as crisp SVG rects so they scale cleanly.

type SpriteProps = { map: string[]; palette: Record<string, string>; className?: string; style?: React.CSSProperties; title?: string };

export function Sprite({ map, palette, className = "", style, title }: SpriteProps) {
  const w = Math.max(...map.map((r) => r.length));
  return (
    <svg
      viewBox={`0 0 ${w} ${map.length}`}
      className={className}
      style={style}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {map.flatMap((row, y) =>
        [...row].map((c, x) => (c === "." || !palette[c] ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[c]} />)),
      )}
    </svg>
  );
}

const INK = "#0f1d3a";

// Two-frame bird: wings up / wings down. Frames swap via CSS (.flap).
export const BIRD_UP = ["K...K", ".K.K.", "..K.."];
export const BIRD_DOWN = [".....", "KKKKK", "..K.."];

export function Bird({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`bird ${className}`} style={style} aria-hidden>
      <Sprite map={BIRD_UP} palette={{ K: INK }} className="bird-a h-full w-full" />
      <Sprite map={BIRD_DOWN} palette={{ K: INK }} className="bird-b h-full w-full" />
    </span>
  );
}

export const FLAG = ["PRRRR", "PRRRR", "PRRR.", "P....", "P....", "P....", "P...."];
export function Flag({ color = "#c23729", className = "", style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return <Sprite map={FLAG} palette={{ P: "#5b3a22", R: color }} className={`flag ${className}`} style={style} />;
}
