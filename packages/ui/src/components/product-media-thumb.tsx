'use client';

import { useState } from 'react';
import { cn } from '../lib/cn';
import { ProductThumb } from './product-thumb';

export function ProductMediaThumb({
  imageUrl,
  imageKey,
  alt,
  className,
  size = 'md',
}: {
  imageUrl?: string;
  imageKey: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <ProductThumb
        imageKey={imageKey}
        alt={alt}
        className={className}
        size={size}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'ah-product-thumb group/product relative flex items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white',
        size === 'lg' && 'min-h-[180px]',
        className,
      )}
    >
      {/* Plain img is intentional: verified supplier media can come from several hosts and we do
          not want Next/Image host configuration to turn valid catalog media into a broken card. */}
      <img
        src={imageUrl}
        alt={alt}
        loading={size === 'lg' ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain bg-white p-2 transition-transform duration-500 ease-out group-hover/product:scale-[1.025]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
