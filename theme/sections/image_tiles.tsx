import type { ReactNode } from 'react';
import { Container, Eyebrow, Heading, Image, sectionColours } from 'ui-kit';

export const schema = {
  label: 'Image tiles',
  icon: 'grid',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['grid', 'mosaic', 'collage'], default: 'grid' },
    { id: 'columns', type: 'select', label: 'Columns (grid)', options: ['3', '2', '4'], default: '3' },
    { id: 'ratio', type: 'select', label: 'Tile shape (grid)', options: ['portrait', 'square', 'landscape'], default: 'portrait' },
    { id: 'text', type: 'select', label: 'Words', options: ['below', 'over'], default: 'below' },
    {
      id: 'tiles', type: 'list', label: 'Tiles', max: 4,
      item: [
        { id: 'image', type: 'image', label: 'Image' },
        { id: 'title', type: 'text', label: 'Title' },
        { id: 'text', type: 'textarea', label: 'Text' },
        { id: 'link_label', type: 'text', label: 'Link label' },
        { id: 'href', type: 'url', label: 'Link' },
      ],
      default: [],
    },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Tile = { image?: { url: string; alt?: string }; title?: string; text?: string; link_label?: string; href?: string };
type Props = {
  eyebrow?: string; heading?: string; layout?: string; columns?: string; ratio?: string; text?: string; tiles?: Tile[];
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

const RATIOS: Record<string, string> = { portrait: '4 / 5', square: '1 / 1', landscape: '4 / 3' };

// Up to four of the merchant's images, each with its title, text and link: a grid, a mosaic (one large tile beside two
// stacked) or a collage (tiles of different sizes, offset). The words sit under each image, or over it on a shade. A
// tile without an image shows the theme's placeholder art. Nothing until the merchant adds a tile.
export default function ImageTiles({ eyebrow, heading, layout = 'grid', columns = '3', ratio = 'portrait', text = 'below', tiles = [], ...colours }: Props) {
  const shown = tiles.filter((x) => x.image || x.title || x.text);
  if (!shown.length) return null;
  const over = text === 'over';
  const tile = (x: Tile, i: number, shape: { aspectRatio?: string; height?: string }, sizes: string) => {
    const words = x.title || x.text || x.link_label ? (
      <div style={{ position: over ? 'absolute' : undefined, left: over ? 0 : undefined, right: over ? 0 : undefined, bottom: over ? 0 : undefined, padding: over ? 'var(--uk-space-5)' : 'var(--uk-space-4) 0 0', color: over ? '#ffffff' : undefined, textAlign: 'left' }}>
        {x.title ? <h3 style={{ margin: 0, fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-sm)', lineHeight: 1.2, color: over ? '#ffffff' : 'var(--uk-color-heading)' }}>{x.title}</h3> : null}
        {x.text ? <p style={{ margin: '6px 0 0', fontSize: 'var(--uk-text-sm)', color: over ? 'rgba(255, 255, 255, 0.88)' : 'var(--uk-color-text-muted)' }}>{x.text}</p> : null}
        {x.link_label && x.href ? <p style={{ margin: 'var(--uk-space-3) 0 0' }}><span className="uk-link" style={{ color: over ? '#ffffff' : undefined }}>{x.link_label}</span></p> : null}
      </div>
    ) : null;
    const media = (
      <div className="uk-media" style={{ aspectRatio: shape.aspectRatio, height: shape.height, borderRadius: 'var(--uk-radius-image, var(--uk-radius-md))' }}>
        {x.image ? <Image src={x.image.url} alt={x.image.alt ?? ''} width={1200} height={1500} sizes={sizes} /> : <svg viewBox="0 0 4 5" aria-hidden="true" />}
        {over && words ? <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%)' }} /> : null}
        {over ? words : null}
      </div>
    );
    const inner: ReactNode = <>{media}{over ? null : words}</>;
    return x.href
      ? <a key={i} href={x.href} className={over ? undefined : 'uk-card-frame'} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>{inner}</a>
      : <div key={i} className={over ? undefined : 'uk-card-frame'}>{inner}</div>;
  };
  let body: ReactNode;
  if (layout === 'mosaic' && shown.length > 1) {
    const [first, ...rest] = shown;
    body = (
      <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: 'var(--uk-space-5)', alignItems: 'stretch' }}>
        {tile(first, 0, { height: 'clamp(320px, 52vw, 640px)' }, '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(55.56vw - 67px), 600px')}
        <div style={{ display: 'grid', gap: 'var(--uk-space-5)' }}>{rest.slice(0, 3).map((x, i) => tile(x, i + 1, { height: `clamp(200px, ${rest.length > 2 ? 16 : 25}vw, ${rest.length > 2 ? 200 : 310}px)` }, '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(44.44vw - 53px), 480px'))}</div>
      </div>
    );
  } else if (layout === 'collage' && shown.length > 1) {
    const [first, ...rest] = shown;
    body = (
      <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--uk-space-7)', alignItems: 'start' }}>
        {tile(first, 0, { aspectRatio: '4 / 5' }, '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(50vw - 72px), 528px')}
        <div style={{ display: 'grid', gap: 'var(--uk-space-7)', paddingTop: 'var(--uk-space-9)' }}>
          {rest.slice(0, 3).map((x, i) => (
            <div key={i} style={{ width: i % 2 ? '72%' : '88%', marginLeft: i % 2 ? 'auto' : undefined }}>{tile(x, i + 1, { aspectRatio: i % 2 ? '1 / 1' : '4 / 3' }, '(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(44vw - 63px), 465px')}</div>
          ))}
        </div>
      </div>
    );
  } else {
    body = <div className={`uk-grid uk-grid--${columns === '2' ? 2 : columns === '4' ? 4 : 3}`}>{shown.map((x, i) => tile(x, i, { aspectRatio: RATIOS[ratio] ?? RATIOS.portrait }, columns === '2' ? '(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(50vw - 60px), 540px' : columns === '4' ? '(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(25vw - 42px), 258px' : '(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(33.33vw - 48px), 352px'))}</div>;
  }
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0', ...sectionColours(colours) }}>
      <Container>
        {eyebrow || heading ? (
          <div style={{ maxWidth: 640, marginBottom: 'var(--uk-space-6)' }}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {heading ? <Heading>{heading}</Heading> : null}
          </div>
        ) : null}
        {body}
      </Container>
    </section>
  );
}
