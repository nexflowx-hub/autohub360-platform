'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { MARKETS, type MarketCode } from '@autohub360/config';
import { cn } from '../lib/cn';

type MarketContextValue = {
  market: MarketCode;
  marketConfig: (typeof MARKETS)[MarketCode];
  setMarket: (market: MarketCode) => void;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({
  initialMarket = 'BR',
  children,
}: {
  initialMarket?: MarketCode;
  children: React.ReactNode;
}) {
  const [market, setMarketState] = useState<MarketCode>(initialMarket);

  const setMarket = useCallback((next: MarketCode) => {
    setMarketState(next);
    document.cookie = `ah_market=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    try {
      window.localStorage.setItem('ah_market', next);
    } catch {
      // Storage can be blocked; the cookie remains the source of truth.
    }
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({ market, marketConfig: MARKETS[market], setMarket }),
    [market, setMarket],
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketContextValue {
  const value = useContext(MarketContext);
  if (!value) {
    throw new Error('useMarket must be used inside MarketProvider');
  }
  return value;
}

export function MarketSwitcher({ className }: { className?: string }) {
  const { market, setMarket } = useMarket();
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1 text-[10px] font-semibold',
        className,
      )}
      aria-label="Selecionar mercado"
    >
      <Globe2 className="ml-1 h-3.5 w-3.5 text-ahblue-300" aria-hidden="true" />
      {(['BR', 'EU'] as MarketCode[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => code !== market && setMarket(code)}
          aria-pressed={market === code}
          className={cn(
            'rounded-full px-2 py-1 transition-colors',
            market === code
              ? 'bg-ahblue-500 text-white shadow-sm'
              : 'text-slate-300 hover:bg-white/10 hover:text-white',
          )}
        >
          {code === 'BR' ? 'Brasil · R$' : 'Europa · €'}
        </button>
      ))}
    </div>
  );
}
