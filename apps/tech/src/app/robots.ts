import type { MetadataRoute } from 'next';
import { techSite } from '@autohub360/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${techSite.url}/sitemap.xml`,
    host: techSite.url,
  };
}
