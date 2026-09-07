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
import { Button, Select } from '@autohub360/ui';
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
} from '@autohub360/catalog';
import { INSTALLATION_FEE_CENTS, formatBRL } from '@autohub360/commerce';

/** PDP buy box: quantity, vehicle compatibility state, somente produto vs + instalação. */
export function ProductBuyBox({ product }: { product: CatalogProduct }) {
  const add = useCart((s) => s.add);
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
  const compatCount = useMemo(
    () => compatibilityVersionIds(product).length,
    [product],
  );

  const compatibleModels = useMemo(() => {
    if (product.universal) return true;
    const ids = new Set(compatibilityVersionIds(product));
    if (!versionId) return true;
    return ids.has(versionId);
  }, [product, versionId]);

  function onAdd() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        sku: product.sku,
        imageKey: product.imageKey,
        unitPriceCents: product.priceCents,
        compareAtCents: product.compareAtCents,
        installation: install && product.installable,
        installable: product.installable,
        universal: product.universal,
        maxStock: product.stock,
      },
      qty,
    );
    if (versionId) track('fitment_checked', { item_id: product.id, fitment_status: status, vehicle: describeVehicle(versionId) });
  }

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-surface-100 pt-4">
      {/* Vehicle fitment block */}
      <section aria-label="Compatibilidade com o seu veículo" className="rounded-lg bg-surface-50 p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink-900">
          <Search className="h-4 w-4 text-ahblue-500" aria-hidden="true" />
          Compatibilidade com o seu veículo
        </p>

        {product.universal ? (
          <p className="flex items-start gap-1.5 text-[13px] leading-relaxed text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Produto universal — funciona em qualquer veículo (ou não depende de veículo).
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {status === 'compatible' && versionId && (
              <p className="flex items-start gap-1.5 text-[13px] font-semibold text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Compatível com {describeVehicle(versionId)}.
              </p>
            )}
            {status === 'not_compatible' && versionId && (
              <p className="flex items-start gap-1.5 text-[13px] font-semibold text-red-600">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Sem compatibilidade confirmada com {describeVehicle(versionId)}. Verifique o
                soquete/fitagem correta antes de comprar.
              </p>
            )}
            {status === 'unconfirmed' && (
              <p className="flex items-start gap-1.5 text-[13px] text-ink-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                Compatibilidade não confirmada — selecione o veículo abaixo para verificar.
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
                ? `${compatCount} versões de veículos catalogadas com compatibilidade confirmada.`
                : 'Compatibilidade em atualização — fale com a equipe pelo WhatsApp para confirmar.'}
            </p>
          </div>
        )}
      </section>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-semibold text-ink-700">
          Quantidade
        </label>
        <div className="flex items-center overflow-hidden rounded-[10px] border border-surface-300">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            className="h-10 w-10 text-lg font-bold text-ink-700 hover:bg-surface-100 disabled:opacity-40"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id="qty"
            readOnly
            value={qty}
            aria-label="Quantidade selecionada"
            className="h-10 w-12 border-x border-surface-300 text-center text-sm font-bold text-ink-900"
          />
          <button
            type="button"
            aria-label="Aumentar quantidade"
            className="h-10 w-10 text-lg font-bold text-ink-700 hover:bg-surface-100 disabled:opacity-40"
            disabled={qty >= product.stock}
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* Installation option */}
      {product.installable && (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-ahorange-500/40 bg-ahorange-500/[0.06] p-3.5">
          <input
            type="checkbox"
            checked={install}
            onChange={(e) => {
              setInstall(e.target.checked);
              if (e.target.checked) track('select_installation', { item_id: product.id });
            }}
            className="mt-0.5 h-4.5 w-4.5 accent-ahorange-500"
          />
          <span className="text-sm">
            <span className="block font-bold text-ink-900">Produto + instalação em Anápolis</span>
            <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-700">
              Adicione a instalação especializada com o parceiro oficial por{' '}
              <strong>{formatBRL(INSTALLATION_FEE_CENTS)}</strong> por unidade. O agendamento é
              combinado após a confirmação do pedido.
            </span>
          </span>
        </label>
      )}

      <div className="flex flex-col gap-2.5">
        <Button
          size="lg"
          disabled={product.stock === 0 || (versionId !== '' && !compatibleModels)}
          onClick={onAdd}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {product.stock === 0 ? 'Produto esgotado' : 'Adicionar ao carrinho'}
        </Button>
        <Button href="/instalacao" variant="ghost-dark" size="md">
          <Wrench className="h-4.5 w-4.5" aria-hidden="true" />
          Agendar somente instalação
        </Button>
      </div>

      <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        *Condições de parcelamento dependem do provedor de pagamento ativo. Imagens ilustrativas.
        Compatibilidade confirmada por base estruturada de veículos.
      </p>
      <Link href="/legal/pagamentos-e-seguranca" className="text-[11px] text-ahblue-600 hover:underline">
        Condições de pagamento e segurança
      </Link>
    </div>
  );
}
