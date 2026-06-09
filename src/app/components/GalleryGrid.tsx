'use client';

import { Reveal } from './ui';

interface Props {
  photos: string[];
  title: string;
}

export default function GalleryGrid({ photos, title }: Props) {
  return (
    <div className="pd-gallery">
      {photos.map((src, i) => (
        <Reveal key={i} className="pd-frame" delay={((i % 3) + 1) as 1 | 2 | 3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${title} — photo ${i + 1}`}
            loading={i < 4 ? 'eager' : 'lazy'}
            onLoad={(e) => {
              const img = e.currentTarget;
              const ratio = img.naturalWidth / img.naturalHeight;
              const frame = img.closest('.pd-frame') as HTMLElement | null;
              if (!frame) return;
              if (ratio > 1.25) frame.classList.add('pd-landscape');
              else if (ratio < 0.8) frame.classList.add('pd-portrait');
            }}
          />
          <div className="corner" />
        </Reveal>
      ))}
    </div>
  );
}
