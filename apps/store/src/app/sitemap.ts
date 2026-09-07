import type { MetadataRoute } from 'next';
import { storeSite } from '@autohub360/config';
import {
  getAllProducts,
  getCategories,
} from '@autohub360/catalog/server';;
import { KITS } from '@autohub360/config';
import { LEGAL_DOCS } from '@autohub360/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = storeSite.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/buscar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/veiculo`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/kits`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/ofertas`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/instalacao`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/atendimento`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/canal-de-reclamacoes`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${base}/categoria/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${base}/produto/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const kitRoutes: MetadataRoute.Sitemap = KITS.map((k) => ({
    url: `${base}/kits/${k.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCS.filter((d) => d.market === 'BR').map((d) => ({
    url: `${base}/legal/${d.slug}`,
    lastModified: new Date(d.updated),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...kitRoutes, ...legalRoutes];
}
