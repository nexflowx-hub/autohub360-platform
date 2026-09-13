'use client';

import { MapPin, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import type { CatalogProduct } from '@autohub360/catalog';
import { resolveProductMarketOffer } from '@autohub360/catalog';
import { Card, Price, useMarket } from '@autohub360/ui';
import { ProductBuyBox } from './product-buy-box';

export function ProductMarketCommerce({ product }: { product: CatalogProduct }) {
  const { market, marketConfig } = useMarket();
  const offer = resolveProductMarketOffer(product, market);

  return (
    <>
      <Card className="p-5">
        {offer ? (
          <Price
            cents={offer.priceCents}
            compareAtCents={offer.compareAtCents}
            currency={offer.currency}
            size="lg"
            showInstallments={false}
          />
        ) : (
          <p className="font-display text-xl font-extrabold text-ink-900">
            Ainda não disponível neste mercado
          </p>
        )}
        <p className="mt-1 text-sm text-ink-500">
          {market === 'BR'
            ? 'Preço de referência. Condições finais são apresentadas quando a oferta estiver validada para compra.'
            : 'Preço em EUR é exibido apenas quando já existe sourcing europeu pesquisado.'}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ahblue-600">
          <Package className="h-4.5 w-4.5" aria-hidden="true" />
          {market === 'BR'
            ? offer?.active && offer.stock > 0
              ? 'Disponível para compra neste mercado.'
              : 'Disponibilidade comercial em validação com o fornecedor.'
            : marketConfig.checkoutEnabled
              ? 'Disponibilidade europeia conforme oferta.'
              : 'Catálogo europeu em preparação — checkout ainda não ativado.'}
        </p>
        <ProductBuyBox product={product} />
      </Card>

      <ul className="grid grid-cols-2 gap-2.5 text-[13px] text-ink-700">
        {market === 'BR' ? (
          <>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <Truck className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
              Entrega nacional após validação logística
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <MapPin className="h-4.5 w-4.5 shrink-0 text-ahorange-500" aria-hidden="true" />
              Loja e retirada em Anápolis
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
              Direitos e garantia conforme legislação aplicável
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <RotateCcw className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
              Política de trocas publicada no site
            </li>
          </>
        ) : (
          <>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <Truck className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
              Logística UE em homologação
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <MapPin className="h-4.5 w-4.5 shrink-0 text-ahorange-500" aria-hidden="true" />
              Operação AutoHub360 Europe
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
              Checkout bloqueado até homologação
            </li>
            <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
              <RotateCcw className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
              Devoluções UE serão definidas por mercado
            </li>
          </>
        )}
      </ul>
    </>
  );
}
