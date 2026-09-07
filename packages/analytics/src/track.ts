'use client';

import { useEffect } from 'react';
import { useConsent } from './consent';

/** Typed, vendor-neutral analytics event layer. */

export type AhEvent =
  | 'view_item'
  | 'view_item_list'
  | 'search'
  | 'vehicle_selected'
  | 'fitment_checked'
  | 'add_to_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'select_delivery_method'
  | 'select_installation'
  | 'purchase'
  | 'whatsapp_click'
  | 'lead_pro'
  | 'contact_submit'
  | 'newsletter_submit'
  | 'appointment_requested';

export interface AhEventData {
  item_id?: string;
  item_name?: string;
  sku?: string;
  value?: number;
  quantity?: number;
  items?: Array<{ item_id: string; item_name: string; price?: number; quantity?: number }>;
  search_term?: string;
  vehicle?: string;
  result_count?: number;
  fitment_status?: string;
  method?: string;
  order_id?: string;
  currency?: string;
  coupon?: string;
  context?: string;
  [key: string]: unknown;
}

type VendorPush = (event: string, params?: Record<string, unknown>) => void;
const vendors: VendorPush[] = [];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: VendorPush };
  }
}

/** Register a vendor adapter. Only called after consent allows it. */
export function registerVendor(push: VendorPush) {
  vendors.push(push);
}

function gtagAdapter(): VendorPush | null {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    return (event, params) => window.gtag?.('event', event, params);
  }
  return null;
}

function metaAdapter(): VendorPush | null {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    return (event, params) => window.fbq?.('trackCustom', event, params);
  }
  return null;
}

function tiktokAdapter(): VendorPush | null {
  if (typeof window !== 'undefined' && window.ttq) {
    return (event, params) => window.ttq?.track(event, params);
  }
  return null;
}

function isLocalDevelopment(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/** Core tracking entry point. Marketing events are gated by consent. */
export function track(event: AhEvent, data: AhEventData = {}) {
  if (typeof window === 'undefined') return;
  const marketingEvents: AhEvent[] = ['add_to_cart', 'begin_checkout', 'purchase', 'search', 'view_item'];
  const consent = useConsent.getState().consent;
  if (marketingEvents.includes(event) && !consent?.analytics) return;

  const payload = { ...data, sent_at: new Date().toISOString() };
  for (const push of [gtagAdapter(), metaAdapter(), tiktokAdapter(), ...vendors]) {
    try {
      push?.(event, payload);
    } catch {
      // Analytics must never break the app.
    }
  }
  if (isLocalDevelopment()) {
    // eslint-disable-next-line no-console
    console.debug('[ah-analytics]', event, payload);
  }
}

/**
 * Loads vendor scripts ONLY when the respective consent category is granted.
 * Called from the ConsentGate component whenever preferences change.
 */
export function syncVendorScripts(gaId: string, metaPixelId: string, tiktokPixelId: string) {
  const { consent } = useConsent.getState();
  const w = typeof window !== 'undefined' ? window : undefined;
  if (!w) return;

  const existing = document.getElementById('ah-analytics-loader');
  if (existing) existing.remove();

  if (!consent?.analytics) return;

  const code = `
  (function(){
    ${gaId && !w.gtag ? `
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});` : ''}
    ${metaPixelId && !w.fbq && consent.marketing ? `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','${metaPixelId}');fbq('track','PageView');` : ''}
    ${tiktokPixelId && window.ttq && consent.marketing ? '' : ''}
  })();
  `;
  const loader = document.createElement('script');
  loader.id = 'ah-analytics-loader';
  loader.textContent = code;
  document.head.appendChild(loader);
}

/** React hook to trigger page-level events without leaking vendor details. */
export function useTrackPage(event: AhEvent, data: AhEventData = {}) {
  useEffect(() => {
    track(event, data);
    // data is intentionally captured at mount; callers should pass stable primitives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
}
