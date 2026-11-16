import { useId } from 'react';
import { Button, Container, Eyebrow, Heading, Image, sectionColours, Text } from 'ui-kit';
import type { SiteInfo } from 'ui-kit';

export const schema = {
  label: 'Hero',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'title', type: 'text', label: 'Title (empty: the store\'s name)' },
    { id: 'title_size', type: 'select', label: 'Title size', options: ['regular', 'large'], default: 'regular' },
    { id: 'subtitle', type: 'textarea', label: 'Subtitle' },
    { id: 'cta_label', type: 'text', label: 'Button label' },
    { id: 'cta_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'secondary_label', type: 'text', label: 'Second button label' },
    { id: 'secondary_href', type: 'url', label: 'Second button link' },
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'artwork', type: 'select', label: 'Artwork (without an image)', options: ['ridge', 'natural', 'dusk', 'lake', 'horizon', 'topo', 'none'], default: 'ridge' },
    { id: 'palette', type: 'select', label: 'Artwork colors', options: ['ridge', 'dusk', 'lake'], default: 'ridge' },
    { id: 'align', type: 'select', label: 'Layout', options: ['left', 'center', 'right'], default: 'center' },
    { id: 'layout', type: 'select', label: 'Image', options: ['boxed', 'overlay', 'bleed', 'image'], default: 'boxed' },
    { id: 'height', type: 'select', label: 'Height (overlay, bleed and image)', options: ['medium', 'tall', 'screen'], default: 'medium' },
    { id: 'scrim', type: 'select', label: 'Shade over the image (overlay)', options: ['medium', 'light', 'strong'], default: 'medium' },
    { id: 'size', type: 'select', label: 'Size', options: ['regular', 'compact'], default: 'regular' },
    { id: 'width', type: 'select', label: 'Text width', options: ['narrow', 'wide'], default: 'narrow' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

const PALETTES: Record<string, string[]> = {
  ridge: ['#dfe6df', '#f0c987', '#a9bdb0', '#5f8a72', '#2f5d46'],
  dusk: ['#ecdccf', '#e8a36f', '#c3a99a', '#8a6f63', '#4a3a35'],
  lake: ['#dbe5ea', '#f3d9a4', '#a7bccb', '#5d7f95', '#2e4b5e'],
};

// A layered mountain landscape for a main hero. The sun and the peak sit inside the middle 640 units, so they
// stay in view when a narrow or split box crops the sides.

function NaturalMountains() {
  const id = useId().replace(/:/g, '');
  const ref = (name: string) => 'url(#' + id + name + ')';
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={id + 'sky'} x2="0%" y2="100%">
          <stop stopColor="#879da6" /><stop offset=".55" stopColor="#d6d8cb" /><stop offset="1" stopColor="#efe2c5" />
        </linearGradient>
        <radialGradient id={id + 'light'} cx="80%" cy="25%" r="65%">
          <stop stopColor="#fff0ce" stopOpacity=".7" /><stop offset="1" stopColor="#fff0ce" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + 'rock'} x2="65%" y2="100%">
          <stop stopColor="#73848a" /><stop offset=".4" stopColor="#65777a" /><stop offset="1" stopColor="#8c9c94" />
        </linearGradient>
        <linearGradient id={id + 'slope'} x2="80%" y2="100%">
          <stop stopColor="#657c70" /><stop offset=".5" stopColor="#405e50" /><stop offset="1" stopColor="#273e34" />
        </linearGradient>
        <linearGradient id={id + 'ground'} x2="0%" y2="100%">
          <stop stopColor="#4a5b43" /><stop offset="1" stopColor="#1f3029" />
        </linearGradient>
        <linearGradient id={id + 'mist'} x2="0%" y2="100%">
          <stop stopColor="#e3ded0" stopOpacity="0" /><stop offset=".65" stopColor="#e3ded0" stopOpacity=".38" /><stop offset="1" stopColor="#e3ded0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill={ref('sky')} />
      <rect width="1200" height="700" fill={ref('light')} />
      <path d="M0 305L92 264L148 286L242 214L278 227L343 181L389 231L442 207L504 263L583 230L650 282L737 219L810 275L875 246L936 277L1020 208L1080 260L1150 245L1200 278V700H0Z" fill="#a0b0ad" />
      <path d="M0 350L72 319L120 335L189 286L234 300L305 251L354 274L414 216L443 228L492 166L515 186L548 135L574 171L599 159L638 210L665 191L720 252L761 232L807 278L861 249L918 299L966 271L1030 320L1086 297L1140 334L1200 313V700H0Z" fill={ref('rock')} />
      <path d="M548 135L528 230L542 260L514 336L553 301L578 391L633 423L593 294L599 159L574 171Z" fill="#465b62" opacity=".58" />
      <path d="M492 166L477 247L453 278L430 352L472 316L494 340L510 246L515 186Z" fill="#bac0b2" opacity=".65" />
      <path d="M548 135L529 189L542 182L548 203L561 188L573 198L563 166Z M492 166L473 211L486 203L493 218L503 205L515 213L507 186Z" fill="#e9e6d8" />
      <path d="M665 191L644 249L656 239L670 260L679 246L697 254Z" fill="#c3c7bb" />
      <g fill="none" stroke="#d1d1bf" strokeWidth="1.4" opacity=".28">
        <path d="M527 220L492 301L465 321L439 384M553 239L575 303L572 327L609 409M648 268L678 324L712 350M731 285L756 309L781 358M331 282L294 329L247 366M879 304L914 341L931 377" />
      </g>
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i * 137 + 29) % 1200;
        const y = 350 + (i * 71) % 110;
        return <path key={i} d={`M${x} ${y}l${8 + i % 15} ${-5 - i % 9}l-6 13`} fill={i % 2 ? '#d6d5c2' : '#344b50'} opacity=".13" />;
      })}
      <path d="M0 398Q140 329 251 397T476 412Q615 467 745 372T1008 402L1200 369V700H0Z" fill="#7c9383" />
      <rect y="320" width="1200" height="200" fill={ref('mist')} />
      <path d="M0 444Q142 376 256 437T502 483Q610 470 710 421T907 418Q1065 354 1200 404V700H0Z" fill={ref('slope')} />
      <g fill="#3d5b4d">
        {Array.from({ length: 110 }, (_, i) => {
          const x = (i * 83 + 17) % 1240 - 20;
          const y = 408 + Math.sin(x / 140) * 24 + (i * 7) % 44;
          const scale = .27 + (i % 9) * .035;
          return <path key={i} transform={`translate(${x} ${y}) scale(${scale})`} d="M0 0L-4 13L-2 12L-9 25L-5 23L-14 40L-8 37L-20 57L-11 53L-24 72L-8 68L-2 72L-2 82H2V72L9 68L24 72L12 53L20 57L9 37L14 40L5 23L9 25L3 12L4 13Z" />;
        })}
      </g>
      <path d="M0 551Q141 463 321 527T609 595Q791 589 941 492T1200 485V700H0Z" fill={ref('ground')} />
      <path d="M640 700Q699 650 741 634T790 601L847 553L826 561L758 606Q718 625 687 629Q625 658 588 700Z" fill="#a99d78" opacity=".7" />
      <path d="M617 700Q672 651 716 639T790 600" fill="none" stroke="#d2c4a0" strokeWidth="3" opacity=".34" />
      <g fill="#213e32">
        {Array.from({ length: 36 }, (_, i) => {
          const x = i < 20 ? i * 24 - 35 : 918 + (i - 20) * 24;
          const y = 452 + Math.sin(x / 123) * 28 + (i * 13) % 58;
          return <path key={i} transform={`translate(${x} ${y}) scale(${.8 + (i % 7) * .12})`} d="M0 0L-4 13L-2 12L-9 25L-5 23L-14 40L-8 37L-20 57L-11 53L-24 72L-8 68L-2 72L-2 82H2V72L9 68L24 72L12 53L20 57L9 37L14 40L5 23L9 25L3 12L4 13Z" />;
        })}
      </g>
      <g fill="#62715b" opacity=".6">
        <path d="M60 654L87 631L119 640L131 657Z M379 600L396 585L424 591L434 609Z M864 660L898 636L937 647L953 674Z" />
      </g>
      {Array.from({ length: 130 }, (_, i) => <path key={i} d={`M${(i * 97) % 1200} ${610 + (i * 31) % 90}l3 -${3 + i % 7}`} stroke="#9a9a76" opacity=".22" />)}
    </svg>
  );
}

function Mountains({ colours }: { colours: string[] }) {
  const [sky, sun, far, mid, near] = colours;
  return (
    <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="1200" height="560" fill={sky} />
      <circle cx="760" cy="200" r="70" fill={sun} />
      <path d="M0 380L220 210L380 330L560 160L760 340L930 230L1200 400V560H0Z" fill={far} />
      <path d="M560 160L524 194L546 190L562 204L578 188L600 196Z" fill="#fff" fillOpacity=".55" />
      <path d="M0 450L180 330L330 420L520 280L700 430L880 340L1200 470V560H0Z" fill={mid} />
      <path d="M0 520L260 430L520 500L800 420L1200 520V560H0Z" fill={near} />
      <path d="M306 456l16-46 16 46zM334 462l13-38 13 38zM676 456l15-44 15 44zM702 462l12-34 12 34zM726 458l10-30 10 30z" fill={near} />
    </svg>
  );
}

// A low horizon with a setting sun, for banners.

function Horizon({ colours }: { colours: string[] }) {
  const [sky, sun, far, mid, near] = colours;
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={id + 'sky'} x2="0%" y2="100%">
          <stop stopColor={far} /><stop offset=".6" stopColor={sky} /><stop offset="1" stopColor={sun} />
        </linearGradient>
        <radialGradient id={id + 'glow'}>
          <stop stopColor="#fff1ce" stopOpacity=".8" /><stop offset=".25" stopColor={sun} stopOpacity=".45" /><stop offset="1" stopColor={sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + 'land'} x2="0%" y2="100%">
          <stop stopColor={mid} /><stop offset="1" stopColor={near} />
        </linearGradient>
      </defs>
      <rect width="1200" height="300" fill={'url(#' + id + 'sky)'} />
      <ellipse cx="705" cy="171" rx="230" ry="160" fill={'url(#' + id + 'glow)'} />
      <circle cx="705" cy="171" r="22" fill="#fff1ce" fillOpacity=".78" />
      <path d="M0 228L51 212L90 219L142 195L172 205L227 181L261 200L318 174L349 184L406 164L451 191L492 177L537 207L579 193L621 218L678 199L729 216L781 192L827 210L879 183L920 205L969 191L1021 218L1093 192L1141 211L1200 197V300H0Z" fill={far} />
      <path d="M0 240Q88 209 181 235T369 233Q481 204 575 235T785 238Q948 207 1053 225T1200 226V300H0Z" fill={mid} fillOpacity=".55" />
      <path d="M0 259Q110 221 236 252T448 260Q622 236 780 261Q890 266 996 234T1200 247V300H0Z" fill={'url(#' + id + 'land)'} />
      <g fill={near} opacity=".8">
        {Array.from({ length: 80 }, (_, i) => {
          const x = (i * 83) % 1250 - 25;
          const y = 242 + Math.sin(x / 160) * 11 + i % 11;
          return <path key={i} transform={`translate(${x} ${y}) scale(${.18 + i % 6 * .04})`} d="M0 0L-5 16L-3 15L-12 33L-7 31L-20 54L-12 50L-25 72L-2 68V80H2V68L25 72L12 50L20 54L7 31L12 33L3 15L5 16Z" />;
        })}
      </g>
      <path d="M0 282Q100 265 230 283T487 283Q643 273 796 288T1040 278L1200 281V300H0Z" fill={near} />
      <g stroke={sky} strokeOpacity=".18" strokeWidth=".8">
        {Array.from({ length: 65 }, (_, i) => <path key={i} d={`M${i * 19} 299l${i % 3 - 1} -${4 + i % 9}`} />)}
      </g>
    </svg>
  );
}

// Contour lines, for banners: two summits drawn as rings of one outline. Each ring is a little larger, turned and
// shifted, so the lines bunch on one side like a slope.
const RING = 'M0-1C.6-1 1.05-.55 1-.05S.62 1 .02.98-1.02.6-1-.02-.55-1 0-1Z';
const STEPS = [1, 1.7, 2.5, 3.2, 4.1, 5, 5.8, 6.9];
function Topo({ colours }: { colours: string[] }) {
  const [sky, , far, mid] = colours;
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1200" height="400" fill={sky} />
      <g fill="none" strokeWidth="1.5">
        {STEPS.map((r, i) => (
          <path key={'a' + i} d={RING} stroke={i % 4 === 3 ? mid : far} vectorEffect="non-scaling-stroke" transform={`translate(${320 + r * 14} ${220 - r * 7}) rotate(${r * 6}) scale(${r * 40 + r * r * 2} ${r * 26 + r * r})`} />
        ))}
        {STEPS.slice(0, 5).map((r, i) => (
          <path key={'b' + i} d={RING} stroke={i % 4 === 3 ? mid : far} vectorEffect="non-scaling-stroke" transform={`translate(${980 - r * 10} ${140 + r * 6}) rotate(${-r * 9}) scale(${r * 34} ${r * 24})`} />
        ))}
      </g>
    </svg>
  );
}

type Props = {
  eyebrow?: string;
  title?: string;
  title_size?: 'regular' | 'large';
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
  secondary_label?: string;
  secondary_href?: string;
  image?: { url: string; alt?: string };
  artwork?: string;
  palette?: string;
  align?: 'left' | 'center' | 'right';
  layout?: string; height?: string; scrim?: string;
  size?: 'regular' | 'compact';
  width?: 'narrow' | 'wide';
  background_colour?: string; text_colour?: string; accent_colour?: string;
  site?: SiteInfo;
};


// The merchant's headline (else the store's name), text and buttons with an image or a drawn landscape. layout:
// boxed (the image in a rounded box below or beside the words), overlay (the words over a full-width image, under a
// shade; light text unless a text color is set, and the buttons in it), bleed (the image filling one half of the
// page to its edge: align left puts the words left) or image (the image alone, full width; its title kept for screen
// readers, the image a link to the button's page when there is one).
export default function Hero(p: Props) {
  if (p.layout === 'overlay' || p.layout === 'bleed' || p.layout === 'image') return <WideHero {...p} />;
  const title = p.title || p.site?.store.name || '';
  const { eyebrow, subtitle, cta_label, cta_href, secondary_label, secondary_href, image, artwork = 'ridge', palette = 'ridge', align = 'center', size = 'regular', width = 'narrow', title_size = 'regular' } = p;
  const split = align !== 'center';
  const right = align === 'right';
  const compact = size === 'compact';
  // The mountain artworks carry their own colors; horizon and topo take the palette field.
  const colours = PALETTES[artwork] ?? PALETTES[palette] ?? PALETTES.ridge;
  const scene = artwork === 'natural' ? <NaturalMountains /> : artwork === 'horizon' ? <Horizon colours={colours} /> : artwork === 'topo' ? <Topo colours={colours} /> : <Mountains colours={colours} />;
  const hasArt = Boolean(image) || artwork !== 'none';
  const artHeight = split ? (compact ? 'clamp(200px, 50vw, 320px)' : 'clamp(240px, 62vw, 480px)') : compact ? 'clamp(140px, 28vw, 220px)' : 'clamp(220px, 44vw, 400px)';
  const heading = !title ? null : title_size === 'large' ? (
    <h1 className="uk-title" style={{ fontFamily: 'var(--uk-font-heading)', color: 'var(--uk-color-heading)', fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: '0 0 var(--uk-space-5)' }}>{title}</h1>
  ) : (
    <Heading level={1} size={compact ? 'xl' : 'display'}>{title}</Heading>
  );
  const copy = (
    <div style={{ textAlign: split ? (right ? 'right' : 'left') : undefined }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading}
      {subtitle ? <Text size="lg" tone="muted">{subtitle}</Text> : null}
      {cta_label || secondary_label ? (
        <div className="uk-cluster" style={{ marginTop: 'var(--uk-space-6)', justifyContent: split ? (right ? 'flex-end' : 'flex-start') : undefined }}>
          {cta_label ? <Button href={cta_href}>{cta_label}</Button> : null}
          {secondary_label ? <Button href={secondary_href} variant="secondary">{secondary_label}</Button> : null}
        </div>
      ) : null}
    </div>
  );
  const art = hasArt ? (
    <div className="uk-media" style={{ height: artHeight, marginTop: split ? 0 : 'var(--uk-space-7)', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
      {image ? <Image src={image.url} alt={image.alt ?? ''} width={1600} height={900} priority sizes={split ? '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(52.8vw - 84px), 550px' : '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(100vw - 96px), 1104px'} /> : scene}
    </div>
  ) : null;
  return (
    <section style={{ padding: hasArt ? 'var(--uk-section-sm) 0' : 'var(--uk-space-7) 0 var(--uk-space-6)', ...sectionColours(p) }}>
      {split ? (
        <Container align={right ? undefined : 'left'}>
          {art ? (
            <div className="uk-split" style={{ gridTemplateColumns: right ? 'minmax(0, 1.12fr) minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1.12fr)', gap: 'var(--uk-space-8)', alignItems: 'center' }}>
              {right ? art : copy}
              {right ? copy : art}
            </div>
          ) : (
            <div style={{ maxWidth: 720, marginLeft: right ? 'auto' : undefined }}>{copy}</div>
          )}
        </Container>
      ) : (
        <>
          <Container width={width} align="center">{copy}</Container>
          {art ? <Container>{art}</Container> : null}
        </>
      )}
    </section>
  );
}

// The overlay, bleed and image layouts (Hero above).
function WideHero(p: Props) {
  const title = p.title || p.site?.store.name || '';
  const { eyebrow, subtitle, cta_label, cta_href, secondary_label, secondary_href, image, artwork = 'ridge', palette = 'ridge', align = 'center', layout, title_size = 'regular', width = 'narrow' } = p;
  const height = p.height === 'screen' ? '100vh' : p.height === 'tall' ? 'clamp(540px, 82vh, 880px)' : 'clamp(440px, 64vh, 680px)';
  const colours = PALETTES[artwork] ?? PALETTES[palette] ?? PALETTES.ridge;
  const scene = artwork === 'none' ? <svg viewBox="0 0 4 3" aria-hidden="true" /> : artwork === 'natural' ? <NaturalMountains /> : artwork === 'horizon' ? <Horizon colours={colours} /> : artwork === 'topo' ? <Topo colours={colours} /> : <Mountains colours={colours} />;
  const media = (
    <div className="uk-media" style={{ position: 'absolute', inset: 0, borderRadius: 0 }}>
      {image ? <Image src={image.url} alt={image.alt ?? ''} width={2400} height={1350} priority sizes={layout === 'bleed' ? '(max-width: 900px) 100vw, 50vw' : '100vw'} /> : scene}
    </div>
  );
  const textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
  const buttons = cta_label || secondary_label ? (
    <div className="uk-cluster" style={{ marginTop: 'var(--uk-space-6)', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
      {cta_label ? <Button href={cta_href}>{cta_label}</Button> : null}
      {secondary_label ? <Button href={secondary_href} variant="secondary">{secondary_label}</Button> : null}
    </div>
  ) : null;
  const copy = (
    <div style={{ textAlign, maxWidth: width === 'wide' ? 820 : 620, marginLeft: textAlign === 'left' ? undefined : 'auto', marginRight: textAlign === 'right' ? undefined : 'auto' }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (title_size === 'large'
        ? <h1 className="uk-title" style={{ fontFamily: 'var(--uk-font-heading)', color: 'var(--uk-color-heading)', fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: '0 0 var(--uk-space-5)' }}>{title}</h1>
        : <Heading level={1} size="display">{title}</Heading>) : null}
      {subtitle ? <Text size="lg" tone="muted">{subtitle}</Text> : null}
      {buttons}
    </div>
  );
  if (layout === 'image') {
    return (
      <section style={{ position: 'relative', height, padding: 0, ...sectionColours(p) }}>
        {title ? <h1 className="uk-visually-hidden">{title}</h1> : null}
        {cta_href && cta_label ? <a href={cta_href} aria-label={cta_label} style={{ position: 'absolute', inset: 0, display: 'block' }}>{media}</a> : media}
      </section>
    );
  }
  if (layout === 'bleed') {
    const imageLeft = align === 'right';
    // the words line up with the page's container: the half's own width less half the container, at least the gutter
    const edge = 'max(var(--uk-gutter), calc(100% - var(--uk-container-wide) / 2 + var(--uk-gutter)))';
    const words = (
      <div style={{ display: 'grid', alignContent: 'center', padding: 'var(--uk-section-md) 0', paddingLeft: imageLeft ? 'var(--uk-space-8)' : edge, paddingRight: imageLeft ? edge : 'var(--uk-space-8)' }}>{copy}</div>
    );
    const picture = <div style={{ position: 'relative', minHeight: 'clamp(300px, 70vw, 560px)' }}>{media}</div>;
    return (
      <section style={{ padding: 0, ...sectionColours(p) }}>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 0, alignItems: 'stretch', minHeight: height }}>
          {imageLeft ? picture : words}
          {imageLeft ? words : picture}
        </div>
      </section>
    );
  }
  // overlay: light words on a shade over the image, unless the merchant set the text color; the accent follows the text
  const text = p.text_colour || '#ffffff';
  const shade = p.scrim === 'light' ? 0.22 : p.scrim === 'strong' ? 0.62 : 0.42;
  return (
    <section style={{ position: 'relative', display: 'grid', alignItems: 'center', minHeight: height, padding: 'calc(var(--uk-section-sm) + 76px) 0 var(--uk-section-sm)', ...sectionColours({ text_colour: text, accent_colour: p.accent_colour || text }) }}>
      {media}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0, 0, 0, ${shade * 0.6}) 0%, rgba(0, 0, 0, ${shade}) 100%)` }} />
      <div style={{ position: 'relative' }}>
        <Container>{copy}</Container>
      </div>
    </section>
  );
}
