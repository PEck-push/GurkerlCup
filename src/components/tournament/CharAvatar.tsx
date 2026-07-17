'use client';

import { avatarFor, avatarCrop } from '@/lib/teamAvatars';
import { COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

/** Runder Charakter-Avatar im Sticker-Rahmen (Gesicht-Crop des Gurkerl-Charakters). */
export default function CharAvatar({
  startNumber,
  img,
  color,
  size,
}: {
  startNumber?: number;
  img?: string;
  color: string;
  size: number;
}) {
  const src = img ?? avatarFor(startNumber);
  const crop = avatarCrop(src);
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${src})`,
        backgroundSize: crop.size,
        backgroundPosition: crop.position,
        backgroundColor: `${color}33`,
        boxShadow: `0 0 0 4px ${COMIC_CREAM}, 0 0 0 8px ${COMIC_OUTLINE}, inset 0 0 30px ${color}55`,
      }}
    />
  );
}
