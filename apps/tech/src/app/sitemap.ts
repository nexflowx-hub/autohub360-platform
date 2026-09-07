import type { MetadataRoute } from 'next';
import { techSite, LEGAL_DOCS } from '@autohub360/config';
import {
  getArticles,
} from '@autohub360/catalog/server';;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = techSite.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/auto-mobility`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/tech`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/smart-living`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/energy`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vision-security`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/instalacao-anapolis`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contato`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/go`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getArticles().map((a) => ({
    url: `${base}/hub/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCS.map((d) => ({
    url: `${base}/legal/${d.slug}`,
    lastModified: new Date(d.updated),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...articleRoutes, ...legalRoutes];
}
