'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BadgePercent,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { Button, Card, Checkbox, Container, Input, ProductThumb } from '@autohub360/ui';
import { INSTALLATION_FEE_CENTS, formatBRL, useCart } from '@autohub360/commerce';
import { track } from '@autohub360/analytics';
import {
  COUPON_CODE,
  COUPON_MIN_SUBTOTAL_CENTS,
  couponDiscountCents,
  readStoredCoupon,
  writeStoredCoupon,
  writeStoredShipping,
  type ShippingOption,
} from '@/lib/coupon';

export default function CarrinhoPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const setInstallation = useCart((s) => s.setInstallation);
  const remove = useCart((s) => s.remove);

  const [mounted, setMounted] = useState(false);
  const [cep, setCep] = useState('');
  const [cepError, setCepError] = useState('');
  const [quoting, setQuoting] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    track('view_cart', {});
    // Restore coupon/shipping selections persisted by this page for checkout.
    if (readStoredCoupon()) setCouponApplied(true);
  }, []);

  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const installationCents = lines.reduce(
    (s, l) => (l.installation ? s + INSTALLATION_FEE_CENTS * l.quantity : s),
    0,
  );
  const discountCents = couponDiscountCents(subtotalCents, couponApplied);
  const shippingCents = selectedOption?.cents ?? 0;
  const totalCents = Math.max(0, subtotalCents + installationCents + shippingCents - discountCents);

  async function onQuote() {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setCepError('Informe um CEP válido com 8 dígitos.');
      return;
    }
    setCepError('');
    setQuoting(true);
    try {
      const res = await fetch('/api/shipping-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: digits, subtotalCents }),
      });
      const data = (await res.json()) as { ok?: boolean; options?: ShippingOption[] };
      if (data.ok && data.options) {
        setOptions(data.options);
        setSelectedOption((cur) => data.options?.find((o) => o.id === cur?.id) ?? data.options![0]!);
      } else {
        setCepError('Não conseguimos calcular o frete agora. Tente novamente.');
      }
    } catch {
      setCepError('Falha de conexão ao calcular o frete.');
    } finally {
      setQuoting(false);
    }
  }

  function onApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code !== COUPON_CODE) {
      setCouponMsg('Cupom inválido ou expirado.');
      return;
    }
    if (subtotalCents < COUPON_MIN_SUBTOTAL_CENTS) {
      setCouponMsg(
        `Este cupom vale para pedidos a partir de ${formatBRL(COUPON_MIN_SUBTOTAL_CENTS)} em produtos.`,
      );
      return;
    }
    setCouponApplied(true);
    setCouponMsg('Cupom aplicado: 10% de desconto nos produtos (demo).');
    writeStoredCoupon(COUPON_CODE);
  }

  function onRemoveCoupon() {
    setCouponApplied(false);
    setCouponMsg('');
    setCouponInput('');
    writeStoredCoupon(null);
  }

  function onSelectOption(option: ShippingOption) {
    setSelectedOption(option);
    writeStoredShipping({ cep: cep.replace(/\D/g, ''), option });
  }

  if (!mounted) {
    return (
      <Container className="flex min-h-[40vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ahblue-500" aria-label="Carregando carrinho" />
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-surface-200 bg-white p-8 text-center shadow-[var(--ah-shadow-card)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-ink-500">
            <ShoppingCart className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink-900">
            Seu carrinho está vazio
          </h1>
          <p className="mt-2 text-[15px] text-ink-500">
            Explore a loja e encontre o que falta para o seu veículo e a sua casa.
          </p>
          <Button href="/buscar" size="lg" className="mt-6 w-full">
            Ver produtos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <h1 className="font-display text-3xl font-extrabold text-ink-900">Carrinho</h1>
      <p className="mt-1 text-[15px] text-ink-500">
        Revise os itens, escolha o frete e finalize sua compra.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:gap-8">
        {/* Lines */}
        <ul className="flex flex-col gap-4">
          {lines.map((line) => (
            <li key={line.productId}>
              <Card className="p-4">
                <div className="flex gap-4">
                  <Link
                    href={`/produto/${line.slug}`}
                    className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
                    aria-label={`Ver ${line.title}`}
                  >
                    <ProductThumb
                      imageKey={line.imageKey}
                      alt={line.title}
                      size="sm"
                      className="h-20 w-20 sm:h-24 sm:w-24"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/produto/${line.slug}`}
                          className="line-clamp-2 font-semibold text-ink-900 transition-colors hover:text-ahblue-600"
                        >
                          {line.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-500">SKU {line.sku}</p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">
                          {formatBRL(line.unitPriceCents)}
                          <span className="font-normal text-ink-500"> /unidade</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.productId)}
                        aria-label={`Remover ${line.title} do carrinho`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4.5 w-4.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center overflow-hidden rounded-[10px] border border-surface-300">
                        <button
                          type="button"
                          aria-label={`Diminuir quantidade de ${line.title}`}
                          className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-surface-100 disabled:opacity-40"
                          disabled={line.quantity <= 1}
                          onClick={() => setQty(line.productId, line.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span
                          className="w-10 border-x border-surface-300 text-center text-sm font-bold text-ink-900"
                          aria-label={`Quantidade: ${line.quantity}`}
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Aumentar quantidade de ${line.title}`}
                          className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-surface-100 disabled:opacity-40"
                          disabled={line.quantity >= (line.maxStock || 99)}
                          onClick={() => setQty(line.productId, line.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="font-display text-base font-extrabold text-ink-900">
                        {formatBRL(line.unitPriceCents * line.quantity)}
                      </p>
                    </div>

                    {/* Installation toggle */}
                    {line.installable && (
                      <div className="mt-3 border-t border-surface-100 pt-3">
                        <Checkbox
                          id={`install-${line.productId}`}
                          checked={line.installation}
                          onChange={(v) => setInstallation(line.productId, v)}
                          label={
                            <span>
                              <strong className="font-semibold text-ink-900">
                                Instalação em Anápolis
                              </strong>{' '}
                              <span className="font-semibold text-ahorange-600">
                                +{formatBRL(INSTALLATION_FEE_CENTS)}/unidade
                              </span>
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="font-display text-lg font-extrabold text-ink-900">Resumo do pedido</h2>

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-700">Subtotal</dt>
                <dd className="font-semibold text-ink-900">{formatBRL(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700">Instalação</dt>
                <dd className="font-semibold text-ink-900">
                  {installationCents > 0 ? formatBRL(installationCents) : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700">Frete</dt>
                <dd className="font-semibold text-ink-900">
                  {selectedOption ? (shippingCents === 0 ? 'Grátis' : formatBRL(shippingCents)) : 'Calcule abaixo'}
                </dd>
              </div>
              {discountCents > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>Desconto (cupom)</dt>
                  <dd className="font-semibold">-{formatBRL(discountCents)}</dd>
                </div>
              )}
            </dl>

            {/* Shipping quote */}
            <div className="mt-5 border-t border-surface-100 pt-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
                <Truck className="h-4 w-4 text-ahblue-500" aria-hidden="true" />
                Calcular frete e prazo
              </p>
              <div className="mt-2.5 flex gap-2">
                <label htmlFor="cep" className="sr-only">
                  CEP de entrega
                </label>
                <Input
                  id="cep"
                  inputMode="numeric"
                  placeholder="CEP: 00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="h-10"
                  aria-invalid={Boolean(cepError)}
                />
                <Button variant="primary" size="sm" className="h-10 px-4" onClick={onQuote} disabled={quoting}>
                  {quoting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : 'Calcular'}
                </Button>
              </div>
              {cepError && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                  {cepError}
                </p>
              )}
              {options.length > 0 && (
                <fieldset className="mt-3">
                  <legend className="sr-only">Opções de entrega</legend>
                  <div className="flex flex-col gap-1.5">
                    {options.map((o) => (
                      <label
                        key={o.id}
                        className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          selectedOption?.id === o.id
                            ? 'border-ahblue-500 bg-ahblue-500/[0.06]'
                            : 'border-surface-200 hover:border-ahblue-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping-option"
                            checked={selectedOption?.id === o.id}
                            onChange={() => onSelectOption(o)}
                            className="h-4 w-4 accent-ahblue-500"
                          />
                          <span>
                            <span className="block font-semibold text-ink-900">{o.label}</span>
                            <span className="block text-xs text-ink-500">
                              até {o.days} {o.days === 1 ? 'dia útil' : 'dias úteis'}
                            </span>
                          </span>
                        </span>
                        <span className="font-semibold text-ink-900">
                          {o.cents === 0 ? 'Grátis' : formatBRL(o.cents)}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>

            {/* Coupon */}
            <div className="mt-5 border-t border-surface-100 pt-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
                <Tag className="h-4 w-4 text-ahorange-500" aria-hidden="true" />
                Cupom de desconto
              </p>
              {couponApplied ? (
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <BadgePercent className="h-4 w-4" aria-hidden="true" />
                    {COUPON_CODE} — 10% aplicado
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    aria-label="Remover cupom"
                    className="text-ink-500 transition-colors hover:text-red-600"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-2.5 flex gap-2">
                    <label htmlFor="coupon" className="sr-only">
                      Código do cupom
                    </label>
                    <Input
                      id="coupon"
                      placeholder="Ex.: AUTOHUB10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="h-10"
                    />
                    <Button variant="ghost-dark" size="sm" className="h-10 px-4" onClick={onApplyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                  {couponMsg && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                      {couponMsg}
                    </p>
                  )}
                  <p className="mt-1.5 text-[11px] text-ink-500">
                    Cupom de demonstração ({COUPON_CODE}): 10% em produtos, pedidos a partir de{' '}
                    {formatBRL(COUPON_MIN_SUBTOTAL_CENTS)}.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-surface-100 pt-4">
              <span className="font-display text-base font-bold text-ink-900">Total</span>
              <span className="font-display text-2xl font-extrabold text-ink-900">
                {formatBRL(totalCents)}
              </span>
            </div>

            <Button href="/checkout" size="lg" className="mt-4 w-full">
              Finalizar compra
            </Button>
            <Button href="/buscar" variant="ghost-dark" size="sm" className="mt-2 w-full">
              Continuar comprando
            </Button>
          </Card>

          <p className="px-1 text-xs leading-relaxed text-ink-500">
            Frete grátis na entrega padrão para pedidos a partir de R$ 399,00 em produtos. Prazos
            contam a partir da confirmação do pagamento.
          </p>
        </aside>
      </div>
    </Container>
  );
}
