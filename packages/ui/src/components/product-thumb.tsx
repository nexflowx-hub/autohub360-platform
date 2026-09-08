import { cn } from '../lib/cn';

type ProductKind =
  | 'led'
  | 'camera'
  | 'screen'
  | 'tracker'
  | 'power'
  | 'charger'
  | 'phone'
  | 'solar'
  | 'smart'
  | 'audio'
  | 'tool';

const kindByKey: Record<string, ProductKind> = {
  'led-kit': 'led',
  'led-bulb': 'led',
  'fog-light': 'led',
  halogen: 'led',
  'rear-cam': 'camera',
  dashcam: 'camera',
  'cam-360': 'camera',
  'cam-solar': 'camera',
  doorbell: 'camera',
  'head-unit': 'screen',
  tracker: 'tracker',
  alarm: 'tracker',
  module: 'tracker',
  scanner: 'tracker',
  multimeter: 'tool',
  'impact-wrench': 'tool',
  'parking-sensor': 'tool',
  compressor: 'power',
  booster: 'power',
  'power-station': 'power',
  powerbank: 'power',
  inverter: 'power',
  charger: 'charger',
  'car-charger': 'charger',
  'wall-charger': 'charger',
  'wireless-charge': 'charger',
  'moto-usb': 'charger',
  cable: 'charger',
  'phone-mount': 'phone',
  tag: 'phone',
  watch: 'phone',
  'solar-panel': 'solar',
  'solar-light': 'solar',
  'smart-bulb': 'smart',
  'smart-plug': 'smart',
  'smart-switch': 'smart',
  hub: 'smart',
  sensor: 'smart',
  'smart-home': 'smart',
  'led-strip': 'smart',
  amp: 'audio',
  speaker: 'audio',
  'speaker-bt': 'audio',
  mic: 'audio',
  gadget: 'tracker',
};

function ProductRender({ kind, id }: { kind: ProductKind; id: string }) {
  const chrome = `chrome-${id}`;
  const dark = `dark-${id}`;
  const blue = `blue-${id}`;
  const orange = `orange-${id}`;
  const glass = `glass-${id}`;

  return (
    <svg viewBox="0 0 220 170" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={chrome} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f8fafc" />
          <stop offset="0.42" stopColor="#94a3b8" />
          <stop offset="0.7" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={dark} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#26384e" />
          <stop offset="0.42" stopColor="#07111f" />
          <stop offset="1" stopColor="#17263a" />
        </linearGradient>
        <linearGradient id={blue} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#075fd8" />
          <stop offset="0.62" stopColor="#0a8cff" />
          <stop offset="1" stopColor="#63c7ff" />
        </linearGradient>
        <linearGradient id={orange} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffb15b" />
          <stop offset="0.5" stopColor="#f97316" />
          <stop offset="1" stopColor="#b83d00" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8bd8ff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#146cb4" stopOpacity="0.8" />
          <stop offset="1" stopColor="#06131f" stopOpacity="0.96" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#07111f" floodOpacity="0.25" />
        </filter>
      </defs>

      <ellipse cx="110" cy="148" rx="64" ry="9" fill="#0f172a" opacity="0.11" />
      <g filter={`url(#shadow-${id})`}>
        {kind === 'led' && (
          <>
            <g transform="translate(52 20)">
              <rect x="18" y="67" width="33" height="49" rx="12" fill={`url(#${dark})`} />
              <path d="M21 73h27l-5 14H26z" fill="#0c82f5" opacity="0.5" />
              <rect x="24" y="20" width="21" height="59" rx="5" fill={`url(#${chrome})`} />
              <rect x="28" y="25" width="13" height="45" rx="4" fill="#effbff" />
              <rect x="30" y="30" width="9" height="13" rx="2" fill="#d8fbff" />
              <rect x="30" y="48" width="9" height="17" rx="2" fill="#81e6ff" />
              <path d="M18 92h33M16 99h37M19 106h31" stroke="#334155" strokeWidth="3" opacity="0.9" />
            </g>
            <g transform="translate(105 26) scale(.88)">
              <rect x="18" y="67" width="33" height="49" rx="12" fill={`url(#${dark})`} />
              <path d="M21 73h27l-5 14H26z" fill="#0c82f5" opacity="0.5" />
              <rect x="24" y="20" width="21" height="59" rx="5" fill={`url(#${chrome})`} />
              <rect x="28" y="25" width="13" height="45" rx="4" fill="#effbff" />
              <rect x="30" y="30" width="9" height="13" rx="2" fill="#d8fbff" />
              <rect x="30" y="48" width="9" height="17" rx="2" fill="#81e6ff" />
              <path d="M18 92h33M16 99h37M19 106h31" stroke="#334155" strokeWidth="3" opacity="0.9" />
            </g>
          </>
        )}

        {kind === 'camera' && (
          <g transform="translate(44 40)">
            <rect width="132" height="82" rx="15" fill={`url(#${dark})`} stroke="#3b536e" strokeWidth="2" />
            <path d="M8 9h72" stroke="#5d7591" strokeWidth="2" opacity="0.5" />
            <circle cx="67" cy="41" r="30" fill="#020712" stroke="#344a64" strokeWidth="4" />
            <circle cx="67" cy="41" r="21" fill={`url(#${glass})`} stroke="#0f2d49" strokeWidth="3" />
            <circle cx="67" cy="41" r="10" fill="#050914" />
            <circle cx="60" cy="34" r="4" fill="#a9ebff" opacity="0.72" />
            <rect x="106" y="12" width="13" height="5" rx="2.5" fill="#f97316" />
            <rect x="113" y="58" width="7" height="7" rx="3.5" fill="#1e90ff" />
          </g>
        )}

        {kind === 'screen' && (
          <g transform="translate(30 27)">
            <rect x="0" y="0" width="160" height="111" rx="16" fill={`url(#${dark})`} stroke="#40566e" strokeWidth="2.5" />
            <rect x="13" y="12" width="126" height="86" rx="10" fill={`url(#${glass})`} />
            <path d="M25 23h50" stroke="#b8efff" strokeWidth="3" opacity="0.55" />
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <g key={n} transform={`translate(${26 + (n % 3) * 31} ${48 + Math.floor(n / 3) * 31})`}>
                <rect width="22" height="22" rx="6" fill={n % 3 === 0 ? `url(#${blue})` : n % 3 === 1 ? `url(#${orange})` : '#14b8a6'} />
                <circle cx="11" cy="11" r="4" fill="white" opacity="0.9" />
              </g>
            ))}
            <circle cx="150" cy="55" r="5" fill="#0d1928" stroke="#6a8098" />
          </g>
        )}

        {kind === 'tracker' && (
          <g transform="translate(59 28)">
            <rect width="102" height="112" rx="17" fill={`url(#${dark})`} stroke="#334a65" strokeWidth="2" />
            <rect x="12" y="13" width="78" height="44" rx="9" fill="#091827" stroke="#244865" />
            <path d="M24 45c9-20 33-26 54-12" stroke="#0a8cff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="28" cy="30" r="4" fill="#29d489" />
            <rect x="16" y="74" width="70" height="8" rx="4" fill="#23384f" />
            <rect x="16" y="90" width="48" height="7" rx="3.5" fill="#263a50" />
            <rect x="77" y="90" width="9" height="7" rx="3.5" fill="#f97316" />
          </g>
        )}

        {kind === 'power' && (
          <g transform="translate(43 31)">
            <rect x="0" y="19" width="136" height="100" rx="18" fill={`url(#${dark})`} stroke="#41546b" strokeWidth="2" />
            <path d="M21 19v-8c0-8 7-11 14-11h67c8 0 14 4 14 11v8" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            <rect x="18" y="37" width="65" height="34" rx="8" fill="#071b2e" stroke="#175e97" />
            <text x="50" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="#63c7ff">AUTO360</text>
            <circle cx="106" cy="53" r="13" fill="#101c2a" stroke="#586b81" strokeWidth="2" />
            <circle cx="106" cy="53" r="5" fill="#f97316" />
            <rect x="18" y="86" width="29" height="17" rx="5" fill="#11283f" stroke="#32658c" />
            <rect x="56" y="86" width="29" height="17" rx="5" fill="#11283f" stroke="#32658c" />
            <rect x="95" y="86" width="21" height="17" rx="5" fill="#11283f" stroke="#32658c" />
            <path d="M126 28h10v74h-10z" fill={`url(#${orange})`} opacity="0.85" />
          </g>
        )}

        {kind === 'charger' && (
          <g transform="translate(73 26)">
            <rect x="0" y="0" width="74" height="103" rx="18" fill={`url(#${dark})`} stroke="#40566f" strokeWidth="2" />
            <rect x="13" y="19" width="48" height="17" rx="6" fill="#071a2c" stroke="#246ca0" />
            <rect x="20" y="23" width="16" height="8" rx="3" fill="#0a8cff" />
            <rect x="40" y="23" width="13" height="8" rx="3" fill="#f97316" />
            <circle cx="37" cy="66" r="15" fill="#101d2c" stroke="#40566f" strokeWidth="2" />
            <path d="M37 55v22M26 66h22" stroke="#63c7ff" strokeWidth="3" strokeLinecap="round" />
            <rect x="24" y="103" width="26" height="19" rx="5" fill={`url(#${chrome})`} />
          </g>
        )}

        {kind === 'phone' && (
          <g transform="translate(70 17)">
            <rect x="14" y="0" width="66" height="124" rx="16" fill={`url(#${dark})`} stroke="#50647b" strokeWidth="2" />
            <rect x="20" y="8" width="54" height="106" rx="12" fill={`url(#${glass})`} />
            <rect x="35" y="13" width="24" height="4" rx="2" fill="#0a1420" />
            <path d="M29 89c15-15 29-19 39-30" stroke="#55c7ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <circle cx="55" cy="55" r="11" fill="#08213b" stroke="#0a8cff" strokeWidth="2" />
            <path d="M0 37h15M79 37h15M4 93h13M77 93h13" stroke="#25384e" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {kind === 'solar' && (
          <g transform="translate(39 34)">
            <path d="M0 76L18 0h126l18 76z" fill="#102c4f" stroke="#506a86" strokeWidth="3" />
            {[0, 1, 2, 3, 4].map((x) => (
              <path key={`v${x}`} d={`M${18 + x * 25} 1L${5 + x * 31} 75`} stroke="#61a8dd" strokeWidth="1.5" opacity="0.7" />
            ))}
            {[1, 2].map((y) => (
              <path key={`h${y}`} d={`M${12 - y * 2} ${y * 25}h${141 + y * 6}`} stroke="#61a8dd" strokeWidth="1.5" opacity="0.7" />
            ))}
            <path d="M74 76v31M52 107h45" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}

        {kind === 'smart' && (
          <g transform="translate(69 20)">
            <rect x="0" y="0" width="82" height="118" rx="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="41" cy="44" r="26" fill="#e9f4fa" stroke="#c8dce8" strokeWidth="2" />
            <circle cx="41" cy="44" r="16" fill={`url(#${glass})`} stroke="#20394c" strokeWidth="3" />
            <circle cx="35" cy="38" r="5" fill="#cbf4ff" opacity="0.75" />
            <rect x="31" y="87" width="20" height="12" rx="6" fill="#0a8cff" opacity="0.85" />
            <path d="M27 105h28" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {kind === 'audio' && (
          <g transform="translate(67 22)">
            <rect x="0" y="0" width="86" height="118" rx="24" fill={`url(#${dark})`} stroke="#3e526a" strokeWidth="2" />
            <circle cx="43" cy="44" r="27" fill="#08111d" stroke="#263b53" strokeWidth="4" />
            <circle cx="43" cy="44" r="18" fill="#172a3e" stroke="#3c5770" strokeWidth="3" />
            <circle cx="43" cy="44" r="7" fill="#0a8cff" opacity="0.85" />
            <circle cx="43" cy="90" r="15" fill="#09121d" stroke="#263b53" strokeWidth="3" />
            <circle cx="43" cy="90" r="5" fill="#f97316" opacity="0.9" />
          </g>
        )}

        {kind === 'tool' && (
          <g transform="translate(45 31)">
            <rect x="0" y="18" width="130" height="84" rx="13" fill={`url(#${dark})`} stroke="#425871" strokeWidth="2" />
            <rect x="14" y="32" width="61" height="39" rx="7" fill="#071a2c" stroke="#1e6feb" />
            <path d="M25 61l10-10 9 5 14-15" stroke="#63c7ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="99" cy="44" r="9" fill="#f97316" />
            <circle cx="99" cy="72" r="9" fill="#172b41" stroke="#50677f" />
            <path d="M31 102v17M98 102v17" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function productThumbRegistryKeys(): string[] {
  return Object.keys(kindByKey);
}

export function ProductThumb({
  imageKey,
  alt,
  className,
  size = 'md',
}: {
  imageKey: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const kind = kindByKey[imageKey] ?? 'tracker';
  const id = imageKey.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'group/product relative flex items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white',
        size === 'lg' && 'min-h-[180px]',
        className,
      )}
      style={{
        background:
          'radial-gradient(circle at 72% 14%, rgba(30,111,235,.13) 0%, transparent 27%), radial-gradient(circle at 24% 78%, rgba(249,115,22,.06) 0%, transparent 25%), linear-gradient(145deg, #ffffff 0%, #f8fafc 57%, #edf3f9 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.05)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover/product:scale-[1.035]">
        <ProductRender kind={kind} id={id} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    </div>
  );
}
