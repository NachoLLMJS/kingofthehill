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

export const TORCH = [
  "..Y..",
  ".YOY.",
  ".ORO.",
  "YORRO",
  ".ORO.",
  "..W..",
  "..W..",
  "..W..",
  ".BWB.",
  "..W..",
  "..W..",
];

export function Torch({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`torch relative inline-block ${className}`} style={style} aria-hidden>
      <span className="torch-glow" />
      <Sprite map={TORCH} palette={{ Y: "#fff3a0", O: "#fbd322", R: "#e8601c", W: "#7a5030", B: "#3a2415" }} className="torch-flame relative h-full w-full" />
    </span>
  );
}

export const BAT = ["K.......K", "KK.K.K.KK", "KKKKKKKKK", ".KKRKRKK.", "...KKK..."];
export function Bat({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <Sprite map={BAT} palette={{ K: "#1b1622", R: "#c23729" }} className={`bat ${className}`} style={style} />;
}

export const CART = [
  ".GGG.G.GG.G.",
  "GGYGGGGYGGGG",
  "KSSSSSSSSSSK",
  "KSDSSSSSSDSK",
  "KSSSSSSSSSSK",
  ".KKKKKKKKKK.",
  "..KWK..KWK..",
  "...K....K...",
];
export function MineCart({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <Sprite
      map={CART}
      palette={{ G: "#fbd322", Y: "#fff3a0", K: INK, S: "#8a8886", D: "#5f5e5d", W: "#c0ddfa" }}
      className={className}
      style={style}
      title="Mine cart full of gold"
    />
  );
}

export const GEM = ["..KKK..", ".KCWCK.", "KCCWCCK", "KCCCCCK", ".KCCCK.", "..KCK..", "...K..."];
export function Gem({ color = "#58e0f5", className = "", style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return <Sprite map={GEM} palette={{ K: INK, C: color, W: "#ffffff" }} className={`gem ${className}`} style={style} />;
}

export const PICKAXE = [
  ".SSSSS...",
  "S.....S..",
  "....W..S.",
  "...W....S",
  "..W......",
  ".W.......",
  "W........",
];
export function Pickaxe({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <Sprite map={PICKAXE} palette={{ S: "#a9a8a6", W: "#9a6a3c" }} className={className} style={style} />;
}

export const FLAG = ["PRRRR", "PRRRR", "PRRR.", "P....", "P....", "P....", "P...."];
export function Flag({ color = "#c23729", className = "", style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return <Sprite map={FLAG} palette={{ P: "#5b3a22", R: color }} className={`flag ${className}`} style={style} />;
}
