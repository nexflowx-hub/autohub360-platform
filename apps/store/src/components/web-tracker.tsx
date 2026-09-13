'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@autohub360/analytics';
import { useMarket } from '@autohub360/ui';

function sessionId(){try{const key='autohub360.websession';const existing=sessionStorage.getItem(key);if(existing)return existing;const id=typeof crypto.randomUUID==='function'?crypto.randomUUID():`ws_${Date.now()}_${Math.random().toString(36).slice(2)}`;sessionStorage.setItem(key,id);return id;}catch{return `ws_${Date.now()}_${Math.random().toString(36).slice(2)}`;}}

export function WebTracker(){const pathname=usePathname();const consent=useConsent((s)=>s.consent);const {market}=useMarket();useEffect(()=>{if(!consent?.analytics)return;const query=new URLSearchParams(window.location.search);const payload={sessionId:sessionId(),eventType:'page_view',path:`${pathname}${window.location.search}`,market,referrer:document.referrer||undefined,utmSource:query.get('utm_source')||undefined,utmMedium:query.get('utm_medium')||undefined,utmCampaign:query.get('utm_campaign')||undefined,utmContent:query.get('utm_content')||undefined,utmTerm:query.get('utm_term')||undefined,device:window.innerWidth<768?'mobile':window.innerWidth<1180?'tablet':'desktop'};void fetch('/api/webtrack',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});},[pathname,market,consent?.analytics]);return null;}
