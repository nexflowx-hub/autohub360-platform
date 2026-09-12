'use client';

import { useEffect } from 'react';
import { track } from '@autohub360/analytics';

export function OfferTracker({ slug, sku }: { slug: string; sku: string }) {
  useEffect(() => {
    track('view_item', {
      item_id: sku,
      sku,
      context: 'offer_funnel',
      offer_slug: slug,
      landing_url: window.location.href,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') ?? undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') ?? undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') ?? undefined,
    });
  }, [slug, sku]);

  return null;
}

export function OfferCtaTracker({
  slug,
  sku,
  children,
  className,
  href,
}: {
  slug: string;
  sku: string;
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        track('whatsapp_click', {
          item_id: sku,
          sku,
          context: 'offer_funnel',
          offer_slug: slug,
        })
      }
    >
      {children}
    </a>
  );
}
