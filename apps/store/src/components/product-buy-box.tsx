'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Wrench,
  Search,
} from 'lucide-react';
import { Button, Select, useMarket } from '@autohub360/ui';
import { track } from '@autohub360/analytics';
import { useCart } from '@autohub360/commerce';
import { useFitmentStore } from '@autohub360/vehicle-fitment';
import type { CatalogProduct } from '@autohub360/catalog';
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleVersions,
  describeVehicle,
  fitmentStatus,
  compatibilityVersionIds,
  resolveProductMarketOffer,
} from '@autohub360/catalog';
import { INSTALLATION_FEE_CENTS, formatBRL } from '@autohub360/commerce';

/** PDP buy box: quantity, vehicle compatibility state, product vs + installation. */
export function ProductBuyBox({ product }: { product: CatalogProduct }) {
  const add = useCart((s) => s.add);
  const { market, marketConfig } = useMarket();
  const offer = resolveProductMarketOffer(product, market);
  const purchasable = Boolean(offer?.active && offer.stock > 0 && marketConfig.checkoutEnabled);
  const [qty, setQty] = useState(1);
  const [install, setInstall] = useState(false);
  const selected = useFitmentStore((s) => s.selected);
  const setVehicle = useFitmentStore((s) => s.setVehicle);

  const [makeId, setMakeId] = useState(selected.makeId ?? '');
  const [modelId, setModelId] = useState(selected.modelId ?? '');
  const [versionId, setVersionId] = useState(selected.versionId ?? '');

  const models = useMemo(() => (makeId ? getVehicleModels(makeId) : []), [makeId]);
  const versions = useMemo(() => (modelId ? getVehicleVersions(modelId) : []), [modelId]);

  const status = fitmentStatus(product, versionId || undefined);
  const compatCount = useMemo(() => compatibilityVersionIds(product).length, [product]);

  const compatibleModels = useMemo(() => {
    if (product.universal) return true;
    const ids = new Set(compatibilityVersionIds(product));
    if (!versionId || ids.size === 0) return true;
    return ids.has(versionId);
  }, [product, versionId]);

  function onAdd() {
    if (!offer || !purchasable) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        sku: product.sku,
        imageKey: product.imageKey,
        imageUrl: product.imageUrl,
        unitPriceCents: offer.priceCents,
        compareAtCents: offer.compareAtCents,
        installation: market === 'BR' && install && product.installable,
        installable: market === 'BR' && product.installable,
        universal: product.universal,
        maxStock: offer.stock,
      },
      qty,
    );
    if (versionId) {
      track('fitment_checked', {
        item_id: product.id,
        fitment_status: status,
        vehicle: describeVehicle(versionId),
      });
    }
  }

  const maxStock = offer?.stock ?? 0;

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-surface-100 pt-4">
      <section aria-label="Compatibilidade com o seu veículo" className="rounded-lg bg-surface-50 p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink-900">
          <Search className="h-4 w-4 text-ahblue-500" aria-hidden="true" />
          Compatibilidade com o seu veículo
        </p>

        {product.universal ? (
          <p className="flex items-start gap-1.5 text-[13px] leading-relaxed text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Produto de aplicação universal conforme a descrição. Em caso de dúvida, confirme as
            medidas e especificações antes da compra.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {status === 'compatible' && versionId && (
              <p className="flex items-start gap-1.5 text-[13px] font-semibold text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Compatibilidade indicada para {describeVehicle(versionId)}. Confirme as
                especificações do veículo e do produto antes da instalação.
              </p>
            )}
            {status === 'not_compatible' && versionId && (
              <p className="flex items-start gap-1.5 text-[13px] font-semibold text-red-600">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Sem compatibilidade cadastrada para {describeVehicle(versionId)}. Verifique o
                soquete, medidas e especificações antes de comprar.
              </p>
            )}
            {status === 'unconfirmed' && (
              <p className="flex items-start gap-1.5 text-[13px] text-ink-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                Compatibilidade não informada — selecione o veículo abaixo para consultar nossa base.
              </p>
            )}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Select
                aria-label="Marca do veículo"
                value={makeId}
                onChange={(e) => {
                  setMakeId(e.target.value);
                  setModelId('');
                  setVersionId('');
                }}
              >
                <option value="">Marca</option>
                {getVehicleMakes('car').map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
                {getVehicleMakes('moto').map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </Select>
              <Select
                aria-label="Modelo"
                value={modelId}
                disabled={!makeId}
                onChange={(e) => {
                  setModelId(e.target.value);
                  setVersionId('');
                }}
              >
                <option value="">Modelo</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </Select>
              <Select
                aria-label="Versão"
                value={versionId}
                disabled={!modelId}
                onChange={(e) => {
                  setVersionId(e.target.value);
                  setVehicle({ makeId, modelId, versionId: e.target.value || undefined });
                }}
              >
                <option value="">Versão / ano</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.yearStart}–{v.yearEnd})
                  </option>
                ))}
              </Select>
            </div>
            <p className="text-[11px] text-ink-500">
              {compatCount > 0
                ? `${compatCount} versões de veículos catalogadas para consulta de compatibilidade.`
                : 'Compatibilidade em atualização — fale com a equipe pelo WhatsApp para confirmar.'}
            </p>
          </div>
        )}
      </section>

      {!compatibleModels && versionId ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="flex items-center gap-2 font-semibold">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Esta aplicação não consta como compatível para o veículo selecionado.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-ink-700">
          Quantidade
          <Select
            value={qty}
            disabled={!purchasable}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-24"
          >
            {Array.from({ length: Math.max(1, Math.min(maxStock, 10)) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
        </label>

        {market === 'BR' && product.installable ? (
          <label className="flex min-h-10 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-surface-200 px-3 py-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={install}
              onChange={(e) => setInstall(e.target.checked)}
              className="h-4 w-4 accent-ahblue-500"
            />
            <Wrench className="h-4 w-4 text-ahorange-500" aria-hidden="true" />
            Adicionar instalação em Anápolis (+{formatBRL(INSTALLATION_FEE_CENTS)})
          </label>
        ) : null}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!purchasable || (!compatibleModels && Boolean(versionId))}
        onClick={onAdd}
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {purchasable ? 'Adicionar ao carrinho' : 'Indisponível para compra agora'}
      </Button>

      {!purchasable ? (
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-ink-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {market === 'EU'
            ? 'O checkout europeu permanece bloqueado enquanto pagamentos, VAT/IVA, logística e devoluções não estiverem homologados.'
            : 'A oferta permanece visível para pesquisa, mas só é liberada para compra depois da validação de disponibilidade e operação.'}
        </p>
      ) : null}

      <Link href="/carrinho" className="text-center text-sm font-semibold text-ahblue-600 hover:underline">
        Ver carrinho
      </Link>
    </div>
  );
}