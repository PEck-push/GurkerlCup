'use client';

/** Team-"Avatar": Emoji in einem farbigen Ring mit Glow – wie die Spieler-Kreise im Leaderboard. */
export default function TeamAvatar({
  color,
  emoji,
  size = 64,
  glow = true,
  ring = 3,
}: {
  color: string;
  emoji: string;
  size?: number;
  glow?: boolean;
  ring?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 leading-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.52,
        background: `radial-gradient(circle at 30% 25%, ${color}55, ${color}18 60%, rgba(0,0,0,0.25))`,
        border: `${ring}px solid ${color}`,
        boxShadow: glow ? `0 0 ${size * 0.35}px ${color}66, inset 0 0 ${size * 0.2}px ${color}22` : 'none',
      }}
    >
      {emoji}
    </span>
  );
}
