import { useId } from 'react';
import type { ReactElement } from 'react';
import { Badge, Image } from 'ui-kit';

const COLOUR_NAMES = ['forest', 'slate', 'rust', 'plum', 'ochre', 'lake', 'bark', 'amber'];
const ARTWORK = ['pack', 'trekpack', 'daypack', 'hydration', 'hippack', 'drybag', 'jacket', 'fleece', 'bottle', 'tent', 'lamp', 'boot'];

// Retired: product grids and search results show the store's own products. Cards typed in by hand before that still
// render, after the store's products, until they are removed; nothing new is added with them.
export const schema = {
  label: 'Product card',
  retired: true,
  fields: [
    { id: 'title', type: 'text', label: 'Product name' },
    { id: 'price', type: 'text', label: 'Price' },
    { id: 'compare_price', type: 'text', label: 'Price before sale' },
    { id: 'note', type: 'text', label: 'Note' },
    {
      id: 'swatches', type: 'list', label: 'Colors', max: 6,
      item: [
        { id: 'swatch', type: 'select', label: 'Swatch', options: COLOUR_NAMES },
        { id: 'name', type: 'text', label: 'Name' },
      ],
    },
    { id: 'badge', type: 'text', label: 'Badge' },
    { id: 'href', type: 'url', label: 'Link' },
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'artwork', type: 'select', label: 'Artwork (without an image)', options: ARTWORK },
    { id: 'colour', type: 'select', label: 'Artwork color', options: COLOUR_NAMES },
  ],
} as const;

const COLOURS: Record<string, string> = {
  forest: '#2f5d46', slate: '#46525e', rust: '#b5573a', plum: '#6b5a7e', ochre: '#a07a2c', lake: '#3d6f8e', bark: '#5c4636', amber: '#c08a2e',
};

const swatch = (name: string | undefined) => {
  const key = name ?? 'forest';
  return COLOURS[key] ?? COLOURS.forest;
};

// The tile behind a drawing: the product color mixed into the sand tile at 12%.
function tint(hex: string) {
  const base = [0xef, 0xe9, 0xdf];
  return '#' + base.map((b, i) => Math.round(b + (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) - b) * 0.12).toString(16).padStart(2, '0')).join('');
}

// Flat product drawings on a 100 x 100 grid, used while a product has no photo. Each stands on y = 86.
const BASE_ART: Record<string, (c: string) => ReactElement> = {
  pack: (c) => (
    <>
      <path d="M39 24c0-10 22-10 22 0" stroke={c} strokeWidth="5" fill="none" />
      <rect x="25" y="22" width="50" height="64" rx="12" fill={c} />
      <path d="M25 36c0-8 6-14 13-14h24c7 0 13 6 13 14v3H25z" fill="#000" fillOpacity=".14" />
      <rect x="31" y="52" width="38" height="26" rx="6" fill="#000" fillOpacity=".15" />
      <rect x="44" y="29" width="12" height="4" rx="2" fill="#fff" fillOpacity=".4" />
    </>
  ),
  trekpack: (c) => (
    <>
      <rect x="26" y="40" width="7" height="22" rx="3" fill={c} />
      <rect x="67" y="40" width="7" height="22" rx="3" fill={c} />
      <rect x="30" y="20" width="40" height="56" rx="9" fill={c} />
      <path d="M28 30c0-9 6-15 14-15h16c8 0 14 6 14 15v4H28z" fill={c} />
      <path d="M28 30c0-9 6-15 14-15h16c8 0 14 6 14 15v4H28z" fill="#000" fillOpacity=".16" />
      <rect x="46" y="31" width="8" height="10" rx="2" fill="#2a2f2b" />
      <path d="M30 54h40" stroke="#000" strokeOpacity=".16" strokeWidth="2" />
      <rect x="22" y="72" width="56" height="14" rx="7" fill="#b9a27c" />
      <path d="M29 73v12" stroke="#000" strokeOpacity=".15" strokeWidth="2" />
      <rect x="36" y="70" width="4" height="18" rx="1" fill={c} />
      <rect x="60" y="70" width="4" height="18" rx="1" fill={c} />
    </>
  ),
  daypack: (c) => (
    <>
      <path d="M43 20c0-6 14-6 14 0" stroke="#2a2f2b" strokeWidth="3" fill="none" />
      <path d="M28 84V42c0-15 10-25 22-25s22 10 22 25v42a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2z" fill={c} />
      <path d="M33 44c0-11 7-19 17-19s17 8 17 19" stroke="#fff" strokeOpacity=".4" strokeWidth="2" fill="none" />
      <rect x="35" y="56" width="30" height="24" rx="6" fill="#000" fillOpacity=".14" />
    </>
  ),
  hydration: (c) => (
    <>
      <path d="M31 18h11l8 16 8-16h11l5 12v50a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V30z" fill={c} />
      <rect x="31" y="44" width="13" height="22" rx="4" fill="#fff" fillOpacity=".3" />
      <rect x="56" y="44" width="13" height="22" rx="4" fill="#fff" fillOpacity=".3" />
      <path d="M50 34v52" stroke="#000" strokeOpacity=".15" strokeWidth="2" />
      <path d="M63 20c8-6 18 0 13 12" stroke="#2a2f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  hippack: (c) => (
    <>
      <path d="M6 64h88" stroke="#2a2f2b" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 62c0-12 13-20 30-20s30 8 30 20v4c0 12-13 20-30 20S20 78 20 66z" fill={c} />
      <path d="M27 58c4-7 12-10 23-10s19 3 23 10" stroke="#fff" strokeOpacity=".45" strokeWidth="2" fill="none" />
      <rect x="62" y="49" width="5" height="10" rx="2" fill="#2a2f2b" />
    </>
  ),
  drybag: (c) => (
    <>
      <rect x="31" y="30" width="38" height="56" rx="10" fill={c} />
      <rect x="29" y="18" width="42" height="13" rx="4" fill={c} />
      <path d="M31 24.5h38" stroke="#000" strokeOpacity=".22" strokeWidth="2" />
      <rect x="44" y="13" width="12" height="10" rx="2" fill="#2a2f2b" />
      <rect x="31" y="52" width="38" height="9" fill="#fff" fillOpacity=".28" />
    </>
  ),
  jacket: (c) => (
    <>
      <path d="M38 19c0-8 5-12 12-12s12 4 12 12l-12 6z" fill={c} />
      <path d="M43 18c0-5 3-8 7-8s7 3 7 8l-7 4z" fill="#000" fillOpacity=".25" />
      <path d="M36 16l14 7 14-7 17 10 6 30-11 3-4-13v40H33V46l-4 13-11-3 6-30z" fill={c} />
      <path d="M50 23v63" stroke="#000" strokeOpacity=".2" strokeWidth="2" />
      <path d="M38 56h7M55 56h7" stroke="#000" strokeOpacity=".2" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  fleece: (c) => (
    <>
      <path d="M36 18l14 6 14-6 17 10 6 30-11 3-4-13v38H33V48l-4 13-11-3 6-30z" fill={c} />
      <path d="M41 18c2 6 5 9 9 9s7-3 9-9" stroke="#000" strokeOpacity=".22" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M50 27v19" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
      <rect x="56" y="40" width="10" height="9" rx="2" fill="#000" fillOpacity=".15" />
      <path d="M33 81h39" stroke="#000" strokeOpacity=".15" strokeWidth="5" />
    </>
  ),
  bottle: (c) => (
    <>
      <path d="M45 16c0-5 10-5 10 0" stroke="#2a2f2b" strokeWidth="3" fill="none" />
      <rect x="41" y="16" width="18" height="12" rx="3" fill="#2a2f2b" />
      <rect x="36" y="28" width="28" height="58" rx="9" fill={c} />
      <rect x="36" y="46" width="28" height="16" fill="#fff" fillOpacity=".28" />
    </>
  ),
  tent: (c) => (
    <>
      <path d="M12 84Q22 48 46 25Q72 38 89 78L63 86Z" fill={c} />
      <path d="M46 25Q52 44 63 86L12 84Q22 47 46 25Z" fill="#ffffff" fillOpacity=".16" />
      <path d="M46 38Q34 57 27 82L55 84Z" fill="#16251e" fillOpacity=".7" />
      <path d="M47 40L41 82L55 84Z" fill={c} />
      <path d="M46 25Q72 38 89 78L63 86Z" fill="#000" fillOpacity=".15" />
    </>
  ),
  lamp: (c) => (
    <>
      <ellipse cx="50" cy="56" rx="34" ry="20" fill="none" stroke="#2a2f2b" strokeWidth="6" />
      <rect x="33" y="60" width="34" height="26" rx="9" fill={c} />
      <circle cx="50" cy="73" r="8" fill="#fff" fillOpacity=".8" />
    </>
  ),
  boot: (c) => (
    <>
      <path d="M30 18h22v38l26 12c6 3 8 8 8 14v4H22V24c0-3 3-6 8-6z" fill={c} />
      <path d="M22 83h64" stroke="#2a2f2b" strokeWidth="6" />
      <path d="M34 30h12M34 38h12M34 46h12" stroke="#fff" strokeOpacity=".3" strokeWidth="2" />
    </>
  ),
};


function DetailedArt({ kind, colour }: { kind: string; colour: string }) {
  const id = useId().replace(/:/g, '');
  const material = 'url(#' + id + 'material)';
  const pack = ['pack', 'trekpack', 'daypack'].includes(kind);
  const garment = kind === 'jacket' || kind === 'fleece';
  return (
    <g>
      <defs>
        <linearGradient id={id + 'material'} x1="0%" y1="0%" x2="100%" y2="35%">
          <stop stopColor={colour} /><stop offset=".23" stopColor={colour} />
          <stop offset=".32" stopColor="#ffffff" stopOpacity=".3" />
          <stop offset=".42" stopColor={colour} />
          <stop offset=".78" stopColor={colour} /><stop offset="1" stopColor="#111c19" />
        </linearGradient>
        <linearGradient id={id + 'sheen'} x2="100%" y2="20%">
          <stop stopColor="#ffffff" stopOpacity=".34" /><stop offset=".45" stopColor="#ffffff" stopOpacity="0" /><stop offset="1" stopColor="#000000" stopOpacity=".28" />
        </linearGradient>
        <radialGradient id={id + 'shadow'}>
          <stop stopColor="#17221b" stopOpacity=".28" /><stop offset=".6" stopColor="#17221b" stopOpacity=".12" /><stop offset="1" stopColor="#17221b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="52" cy="89" rx={kind === 'tent' ? 45 : 32} ry="5" fill={'url(#' + id + 'shadow)'} />
      {BASE_ART[kind](material)}
      {pack ? (
        <g>
          <path d="M28 39Q21 58 25 78M72 39Q79 58 75 78" fill="none" stroke="#1e2825" strokeWidth="3" />
          <path d="M34 40L33 49M66 40L67 49M34 69L35 82M66 69L65 82" fill="none" stroke="#16231c" strokeWidth="2.6" />
          <path d="M34 40L33 49M66 40L67 49" fill="none" stroke="#a9b6a6" strokeWidth=".6" />
          <rect x="31.5" y="45" width="4" height="5" rx=".6" fill="#242c29" stroke="#8c978d" strokeWidth=".4" />
          <rect x="64.5" y="45" width="4" height="5" rx=".6" fill="#242c29" stroke="#8c978d" strokeWidth=".4" />
          <path d="M37 56Q50 52 64 56M36 74Q50 78 64 74M30 36Q27 57 30 75M69 36Q73 56 70 75" fill="none" stroke="#d8dfcf" strokeOpacity=".36" strokeWidth=".5" strokeDasharray="1.2 1.1" />
          <path d="M38 59L61 59" stroke="#15261d" strokeWidth="1.1" /><path d="M61 59v4l2 1" fill="none" stroke="#aeb8aa" strokeWidth=".8" />
          <path d="M29 80Q50 89 72 80L71 86H30Z" fill="#13241c" fillOpacity=".45" />
          <path d="M40 41Q45 39 46 41M59 65L62 69M39 71L37 77" fill="none" stroke="#dce4d0" strokeOpacity=".18" strokeWidth=".7" />
        </g>
      ) : null}
      {garment ? (
        <g>
          <path d="M35 23Q40 39 37 53L35 77M66 22Q61 39 65 54L68 80M26 31L24 51M77 30L81 51" fill="none" stroke="#ffffff" strokeOpacity=".22" strokeWidth=".8" />
          <path d="M34 32L36 43L33 50M69 33L65 43L69 48M37 68L41 74L38 78M63 68L59 76L64 79" fill="none" stroke="#111b18" strokeOpacity=".25" strokeWidth="1.1" />
          <path d="M33 84H72M20 54L28 56M77 56L84 54" stroke="#202724" strokeOpacity=".45" strokeWidth="2.5" />
          <path d="M39 53L37 67M62 53L64 67" stroke="#182522" strokeWidth=".9" />
          <path d="M50 25V83" stroke="#bac1af" strokeWidth=".7" strokeDasharray=".6 .7" />
          <rect x="49" y="28" width="2" height="3" rx=".4" fill="#a6ada5" />
          <path d="M35 21L34 38M67 21L68 38" fill="none" stroke="#eceadd" strokeOpacity=".32" strokeWidth=".45" strokeDasharray="1 1" />
          {kind === 'fleece' ? Array.from({ length: 80 }, (_, i) => <path key={i} d={`M${36 + (i * 7) % 30} ${31 + (i * 13) % 48}l.7 -.5`} stroke="#fff" strokeOpacity=".16" strokeWidth=".5" />) : null}
        </g>
      ) : null}
      {kind === 'bottle' ? (
        <g>
          <path d="M40 34Q38 57 40 79" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="1.5" />
          <path d="M60 35V79Q59 83 53 84" fill="none" stroke="#10272b" strokeOpacity=".35" strokeWidth="1.1" />
          <path d="M41 20H59M41 23H59M38 81Q50 84 62 81" fill="none" stroke="#b7c0b5" strokeOpacity=".6" strokeWidth=".5" />
          <ellipse cx="50" cy="29" rx="11" ry="2" fill="#fff" fillOpacity=".2" />
          <path d="M39 48H61M39 61H61" stroke="#fff" strokeOpacity=".16" strokeWidth=".45" />
        </g>
      ) : null}
      {kind === 'tent' ? (
        <g>
          <path d="M14 83L46 27L87 77M46 27L63 81" fill="none" stroke="#ece9cf" strokeWidth="1.2" />
          <path d="M26 64L16 88M77 61L94 87M46 28L39 89" fill="none" stroke="#dfd8b8" strokeWidth=".45" />
          <path d="M20 85L14 88M92 84L95 87M37 86L40 89" stroke="#313e36" strokeWidth="1.2" />
          <path d="M17 81L61 85L89 78" fill="none" stroke="#252c22" strokeWidth="1.5" />
          <path d="M49 39L55 69M65 51L78 70" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth=".5" />
        </g>
      ) : null}
      {kind === 'drybag' ? (
        <g>
          <path d="M35 36Q32 56 36 76M64 36Q68 56 64 77" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="1" />
          <path d="M31 27H69M35 80Q50 84 65 80" fill="none" stroke="#142820" strokeOpacity=".4" strokeWidth=".8" />
          <path d="M45 15H55V21H45Z" fill="none" stroke="#8b958b" strokeWidth=".6" />
        </g>
      ) : null}
      {kind === 'hydration' ? (
        <g fill="none">
          <path d="M32 22L38 36L31 75M68 22L62 36L69 75M45 46H55M44 64H56" stroke="#ccd4c2" strokeOpacity=".45" strokeWidth=".7" />
          <path d="M36 49V62M62 49V62" stroke="#172c24" strokeWidth="1.3" strokeDasharray="1 1" />
        </g>
      ) : null}
      {kind === 'hippack' ? (
        <g fill="none">
          <path d="M25 67Q50 91 75 67M28 58Q50 45 72 58" stroke="#e8e6d3" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="1 1" />
          <path d="M29 58H70" stroke="#192c22" strokeWidth="1" />
          <rect x="7" y="61" width="7" height="6" rx="1" stroke="#a6ac9d" strokeWidth=".5" fill="#28332a" />
        </g>
      ) : null}
      {kind === 'lamp' ? (
        <g>
          <circle cx="50" cy="73" r="10" fill="#303c38" /><circle cx="50" cy="73" r="7.5" fill="#bfc8bd" />
          <circle cx="50" cy="73" r="5.5" fill="#edf0dc" /><circle cx="48" cy="71" r="2.5" fill="#fff" />
          <path d="M23 47L30 48M69 48L77 46M18 55L26 57M74 57L82 55" stroke="#838d80" strokeWidth="1" />
          <rect x="42" y="59" width="16" height="2" rx="1" fill="#26332b" />
        </g>
      ) : null}
      {kind === 'boot' ? (
        <g>
          <path d="M27 22V57L41 66L69 73M56 61L55 72" fill="none" stroke="#e5dbc7" strokeOpacity=".5" strokeWidth=".7" strokeDasharray="1 1" />
          <path d="M31 30L48 38L32 46L48 54" fill="none" stroke="#d4c8a8" strokeWidth="1.1" />
          <path d="M24 81H85M28 86V88M39 86V88M50 86V88M62 86V88M74 86V88M83 85V87" stroke="#17231d" strokeWidth="1.7" />
          <path d="M58 67Q76 61 84 78L65 78Z" fill="#162821" fillOpacity=".5" />
        </g>
      ) : null}
    </g>
  );
}
const ART: Record<string, (c: string) => ReactElement> = Object.fromEntries(
  Object.keys(BASE_ART).map((kind) => [kind, (c: string) => <DetailedArt kind={kind} colour={c} />])
);

type Props = {
  title?: string;
  price?: string;
  compare_price?: string;
  note?: string;
  swatches?: { swatch?: string; name?: string }[];
  badge?: string;
  href?: string;
  image?: { url: string; alt?: string };
  artwork?: string;
  colour?: string;
};

export default function ProductCard({ title, price, compare_price, note, swatches = [], badge, href, image, artwork = 'pack', colour = 'forest' }: Props) {
  const draw = ART[artwork] ?? ART.pack;
  const fill = swatch(colour);
  return (
    <a href={href} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div className="uk-media" style={{ aspectRatio: '4 / 5', background: image ? undefined : 'radial-gradient(ellipse at 30% 20%, var(--uk-color-surface), ' + tint(fill) + ')' }}>
        {image ? (
          <Image src={image.url} alt={image.alt ?? title} width={800} height={1000} sizes="(max-width: 560px) calc(50vw - 30px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(33.33vw - 48px), 352px" />
        ) : (
          <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: '68%', height: 'auto' }}>
      
            {draw(fill)}
          </svg>
        )}
        {badge ? (
          <span style={{ position: 'absolute', top: 12, left: 12 }}>
            <Badge tone={compare_price ? 'sale' : 'neutral'}>{badge}</Badge>
          </span>
        ) : null}
      </div>
      <h3 style={{ margin: '14px 0 2px', fontSize: 'var(--uk-text-md)', fontWeight: 600, lineHeight: 1.35, color: 'var(--uk-color-ink)' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
        {compare_price ? <s style={{ marginRight: 8, color: 'var(--uk-color-text-subtle)' }}>{compare_price}</s> : null}
        <span style={{ color: compare_price ? 'var(--uk-color-sale)' : undefined, fontWeight: compare_price ? 600 : undefined }}>{price}</span>
      </p>
      {swatches.length || note ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 }}>
          {swatches.length ? (
            <span style={{ display: 'inline-flex', gap: 5 }}>
              {swatches.map((s, i) => (
                <span key={i} role="img" aria-label={s.name} title={s.name} style={{ width: 12, height: 12, borderRadius: 999, background: swatch(s.swatch), boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .15)' }} />
              ))}
            </span>
          ) : null}
          {note ? <span style={{ fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-subtle)' }}>{note}</span> : null}
        </div>
      ) : null}
    </a>
  );
}
