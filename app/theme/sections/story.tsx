import { useId } from 'react';
import { Container, Eyebrow, Heading, Image, sectionColours } from 'ui-kit';

export const schema = {
  label: 'Story',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'body', type: 'textarea', label: 'Text (a blank line starts a new paragraph)' },
    { id: 'quote', type: 'textarea', label: 'Pull quote' },
    { id: 'quote_author', type: 'text', label: 'Quote by' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link' },
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'artwork', type: 'select', label: 'Artwork (without an image)', options: ['lake', 'ridge', 'dusk', 'topo', 'none'], default: 'lake' },
    { id: 'layout', type: 'select', label: 'Image side', options: ['left', 'right'], default: 'left' },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'sand'], default: 'page' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

const SCENES: Record<string, string[]> = {
  ridge: ['#dfe6df', '#f0c987', '#a9bdb0', '#5f8a72', '#2f5d46'],
  dusk: ['#ecdccf', '#e8a36f', '#c3a99a', '#8a6f63', '#4a3a35'],
  lake: ['#dbe5ea', '#f3d9a4', '#a7bccb', '#5d7f95', '#2e4b5e'],
};

// A tall landscape with a lake, shown while the story has no image.
function Scene({ name }: { name: string }) {
  const [sky, sun, far, mid, near] = SCENES[name] ?? SCENES.lake;
  const id = useId().replace(/:/g, '');
  const ref = (name: string) => 'url(#' + id + name + ')';
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={id + 'sky'} x2="0%" y2="100%">
          <stop stopColor={far} /><stop offset=".55" stopColor={sky} /><stop offset="1" stopColor={sun} />
        </linearGradient>
        <radialGradient id={id + 'light'} cx="80%" cy="25%" r="65%">
          <stop stopColor="#fff0ce" stopOpacity=".7" /><stop offset="1" stopColor="#fff0ce" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + 'rock'} x2="65%" y2="100%">
          <stop stopColor="#73848a" /><stop offset=".4" stopColor="#65777a" /><stop offset="1" stopColor="#8c9c94" />
        </linearGradient>
        <linearGradient id={id + 'slope'} x2="80%" y2="100%">
          <stop stopColor={mid} /><stop offset=".5" stopColor="#405e50" /><stop offset="1" stopColor={near} />
        </linearGradient>
        <linearGradient id={id + 'ground'} x2="0%" y2="100%">
          <stop stopColor="#4a5b43" /><stop offset="1" stopColor="#1f3029" />
        </linearGradient>
        <linearGradient id={id + 'mist'} x2="0%" y2="100%">
          <stop stopColor="#e3ded0" stopOpacity="0" /><stop offset=".65" stopColor="#e3ded0" stopOpacity=".38" /><stop offset="1" stopColor="#e3ded0" stopOpacity="0" />
        </linearGradient>
      <linearGradient id={id + 'water'} x2="0%" y2="100%">
          <stop stopColor="#9cabac" /><stop offset=".6" stopColor="#718e94" /><stop offset="1" stopColor="#526e76" />
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill={ref('sky')} />
      <rect width="1200" height="700" fill={ref('light')} />
      <path d="M0 305L92 264L148 286L242 214L278 227L343 181L389 231L442 207L504 263L583 230L650 282L737 219L810 275L875 246L936 277L1020 208L1080 260L1150 245L1200 278V700H0Z" fill={far} />
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
      {name === 'lake' ? (
        <g>
          <path d="M0 512Q200 526 390 507T740 516Q1040 491 1200 511V700H0Z" fill={ref('water')} />
          <path d="M250 513L423 525L548 594L637 530L812 512Z" fill="#d4d6c5" fillOpacity=".2" />
          <path d="M520 518L548 594L578 524L568 562Z" fill="#344d54" fillOpacity=".16" />
          {Array.from({ length: 34 }, (_, i) => {
            const x = 100 + (i * 127) % 950;
            const y = 520 + (i * 17) % 110;
            return <path key={i} d={`M${x} ${y}h${20 + (i * 11) % 90}`} stroke="#e5e7d5" strokeOpacity={.1 + (i % 3) * .04} strokeWidth=".9" />;
          })}
        </g>
      ) : null}
      <path d={name === 'lake' ? 'M0 588Q102 575 245 639L442 700H0Z M840 700Q1037 579 1200 570V700Z' : 'M0 551Q141 463 321 527T609 595Q791 589 941 492T1200 485V700H0Z'} fill={ref('ground')} />
      <path d="M640 700Q699 650 741 634T790 601L847 553L826 561L758 606Q718 625 687 629Q625 658 588 700Z" fill="#a99d78" opacity={name === 'lake' ? 0 : .7} />
      <path d="M617 700Q672 651 716 639T790 600" fill="none" stroke="#d2c4a0" strokeWidth="3" opacity={name === 'lake' ? 0 : .34} />
      <g fill="#213e32">
        {Array.from({ length: 36 }, (_, i) => {
          const x = i < 20 ? i * 24 - 35 : 918 + (i - 20) * 24;
          const y = (name === 'lake' ? 535 : 452) + Math.sin(x / 123) * 28 + (i * 13) % 58;
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

// Contour lines on a sand ground: one summit drawn as rings of one outline. Each ring is a little larger, turned and
// shifted, so the lines bunch on one side like a slope.
const RING = 'M0-1C.6-1 1.05-.55 1-.05S.62 1 .02.98-1.02.6-1-.02-.55-1 0-1Z';
const STEPS = [1, 1.7, 2.5, 3.2, 4.1, 5, 5.8, 6.9, 8, 9.2, 10.5];
function Topo() {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 600 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id + 'paper'} x2="100%" y2="70%">
          <stop stopColor="#f4eddc" /><stop offset=".48" stopColor="#ded3be" /><stop offset=".5" stopColor="#f3ead7" /><stop offset="1" stopColor="#d8cbb1" />
        </linearGradient>
      </defs>
      <rect width="600" height="640" fill={'url(#' + id + 'paper)'} />
      <g stroke="#b6aa8d" strokeWidth=".5" opacity=".28">
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 60} 0V640M0 ${i * 60}H600`} />)}
      </g>
      <g fill="none" strokeWidth="1.5">
        {STEPS.map((r, i) => (
          <path key={i} d={RING} stroke={i % 4 === 3 ? '#8a6f63' : '#c3a99a'} vectorEffect="non-scaling-stroke" transform={`translate(${250 + r * 9} ${300 + r * 6}) rotate(${r * 7}) scale(${r * 30 + r * r * 1.4} ${r * 26 + r * r})`} />
        ))}
      </g>
      <circle cx="259" cy="306" r="5" fill="#8a6f63" />
      <path d="M300 0V640M0 320H600" stroke="#746449" strokeOpacity=".16" strokeWidth="2" />
      <path d="M302 0V640M0 322H600" stroke="#fff9e9" strokeOpacity=".55" strokeWidth="1" />
    </svg>
  );
}

type Props = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  quote?: string;
  quote_author?: string;
  link_label?: string;
  link_href?: string;
  image?: { url: string; alt?: string };
  artwork?: string;
  layout?: string;
  tone?: string;
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

// The merchant's story: nothing until they write some of it or add an image (TD23 review: no instruction copy on the
// live site). Artwork none with no image: the words alone, in a narrow centered column (an imported rich text block).
export default function Story({ eyebrow, heading, body, quote, quote_author, link_label, link_href, image, artwork = 'lake', layout = 'left', tone = 'page', ...colours }: Props) {
  const paragraphs = String(body ?? '').split(/\n\s*\n/).map((t) => t.trim()).filter((t) => t !== '');
  if (!eyebrow && !heading && !paragraphs.length && !quote && !link_label && !image) return null;
  const sand = tone === 'sand';
  const art = image || artwork !== 'none' ? (
    <div className="uk-media" style={{ height: 'clamp(240px, 56vw, 420px)', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
      {image ? <Image src={image.url} alt={image.alt ?? ''} width={1200} height={1100} sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(50vw - 80px), 520px" /> : artwork === 'topo' ? <Topo /> : <Scene name={artwork} />}
    </div>
  ) : null;
  const copy = (
    <div style={{ maxWidth: art ? 520 : 640, margin: art ? undefined : '0 auto', textAlign: art ? undefined : 'center' }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? <Heading>{heading}</Heading> : null}
      {paragraphs.map((t, i) => (
        <p key={i} style={{ margin: '14px 0 0', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t}</p>
      ))}
      {quote ? (
        <figure style={{ margin: 'var(--uk-space-6) 0 0', paddingLeft: 'var(--uk-space-5)', borderLeft: '3px solid var(--uk-color-accent)' }}>
          <blockquote style={{ margin: 0, fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-text-xl)', lineHeight: 1.35, color: 'var(--uk-color-heading)' }}>“{quote}”</blockquote>
          {quote_author ? <figcaption style={{ marginTop: 'var(--uk-space-2)', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{quote_author}</figcaption> : null}
        </figure>
      ) : null}
      {link_label ? (
        <p style={{ margin: 'var(--uk-space-6) 0 0' }}>
          <a className="uk-link" href={link_href}>{link_label}</a>
        </p>
      ) : null}
    </div>
  );
  return (
    <section style={{ padding: `${sand ? 'var(--uk-section-md)' : 'var(--uk-section-sm)'} 0`, background: sand ? 'var(--uk-color-muted-bg)' : undefined, ...sectionColours(colours) }}>
      <Container>
        {art ? (
          <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--uk-space-8)', alignItems: 'center' }}>
            {layout === 'right' ? copy : art}
            {layout === 'right' ? art : copy}
          </div>
        ) : copy}
      </Container>
    </section>
  );
}
