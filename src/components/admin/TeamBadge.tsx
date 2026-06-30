interface TeamBadgeProps {
  color: string;
  emoji: string;
  name: string;
  startNumber?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { circle: 'w-7 h-7 text-base', name: 'text-sm', num: 'text-[10px]' },
  md: { circle: 'w-9 h-9 text-lg', name: 'text-base', num: 'text-xs' },
  lg: { circle: 'w-12 h-12 text-2xl', name: 'text-lg', num: 'text-sm' },
};

/** Farbiger Emoji-Kreis + optionale Startnummer + Teamname. */
export default function TeamBadge({ color, emoji, name, startNumber, size = 'md' }: TeamBadgeProps) {
  const s = sizeMap[size];
  return (
    <span className="inline-flex items-center gap-2.5 min-w-0">
      <span
        className={`${s.circle} flex-shrink-0 rounded-full flex items-center justify-center leading-none`}
        style={{ background: `${color}22`, border: `2px solid ${color}` }}
      >
        {emoji}
      </span>
      <span className="min-w-0">
        {startNumber !== undefined && (
          <span className={`block font-bebas tracking-wide ${s.num}`} style={{ color }}>
            #{startNumber}
          </span>
        )}
        <span className={`block font-fredoka font-600 text-white truncate ${s.name}`}>{name}</span>
      </span>
    </span>
  );
}
