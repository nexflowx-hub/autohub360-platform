import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoHub360 Store',
    short_name: 'AutoHub360',
    description:
      'Peças, acessórios, eletrônicos e soluções inteligentes com instalação especializada.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a1628',
    theme_color: '#0a1628',
    lang: 'pt-BR',
    categories: ['shopping', 'automotive'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Ofertas', url: '/ofertas' },
      { name: 'Meu carrinho', url: '/carrinho' },
      { name: 'Instalação', url: '/instalacao' },
    ],
  };
}
