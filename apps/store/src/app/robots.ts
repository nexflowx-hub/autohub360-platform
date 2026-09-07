import type { MetadataRoute } from 'next';
import { storeSite } from '@autohub360/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/conta', '/carrinho', '/pedido/'],
      },
    ],
    sitemap: `${storeSite.url}/sitemap.xml`,
    host: storeSite.url,
  };
}
