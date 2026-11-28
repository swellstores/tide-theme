import type { ProductList, SiteInfo, Translate } from 'ui-kit';
import { Carousel, carouselLabels, Container, Eyebrow, Heading, pricesHiddenFor, ProductCard, QuickAdd, sectionColours } from 'ui-kit';

// The store's products (Store products) in a row the shopper swipes or scrolls (2026-11-27): ui-kit's Carousel, so every
// card is in the page and works without any script; the platform script adds the arrows and dots. Per view: the cards a
// wide screen shows at once (a tablet shows up to 3, a phone 2, or 1 for 2), with the next card's edge showing unless
// turned off. Cards as the product grid's (the theme's swatches and quick add too). Nothing without products.
export const schema = {
  label: 'Product carousel',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Products' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'View all' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 24, default: { from: 'all', sort: 'best_selling', limit: 8 } },
    { id: 'per_view', type: 'select', label: 'Products per view on a wide screen', options: ['4', '3', '5', '2'], default: '4' },
    { id: 'card', type: 'select', label: 'Product cards (badges: sale, sold out; swap: 2nd photo on hover)', options: ['plain', 'badges', 'swap', 'both'], default: 'plain' },
    { id: 'peek', type: 'select', label: 'Show the edge of the next product', options: ['on', 'off'], default: 'on' },
    { id: 'loop', type: 'select', label: 'Arrows go round from the last product to the first', options: ['no', 'yes'], default: 'no' },
    { id: 'autoplay', type: 'select', label: 'Move by itself, every (seconds; shoppers can pause)', options: ['off', '4', '5', '6', '8', '10'], default: 'off' },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'sand'], default: 'page' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = {
  t: Translate; site?: SiteInfo; eyebrow?: string; heading?: string; link_label?: string; link_href?: string; products?: ProductList | null; per_view?: string; card?: string;
  peek?: string; loop?: string; autoplay?: string; tone?: string; background_colour?: string; text_colour?: string; accent_colour?: string;
};

// How wide a card shows at n per view in the wide container (24 px gaps; the phone's 24 px gutters), for its photo's sizes.
const width = (n: number, page: string) => (n === 1 ? page : `calc((${page} - ${(n - 1) * 24}px) / ${n})`);

export default function ProductCarousel(p: Props) {
  const { t, eyebrow, link_label, link_href, tone = 'page' } = p;
  const items = p.products && typeof p.products === 'object' && Array.isArray(p.products.items) ? p.products.items : [];
  if (!items.length) return null;
  const desktop = Math.max(2, Math.min(5, Number(p.per_view) || 4));
  const tablet = Math.min(3, desktop);
  const phone = desktop === 2 ? 1 : 2;
  const heading = p.heading || (link_label && !eyebrow ? t(p.site?.page.kind === 'product' ? 'product.related' : 'collection.popular') : '');
  const head = eyebrow || heading || link_label;
  const sand = tone === 'sand';
  const space = sand ? 'var(--uk-section-md)' : 'var(--uk-section-sm)';
  const ts = p.site?.theme_settings ?? {};
  const swatches = typeof ts.card_swatches === 'number' ? Math.max(0, Math.min(8, Math.round(ts.card_swatches))) : 0;
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const sizes = `(max-width: 560px) ${width(phone, '100vw - 48px')}, (max-width: 900px) ${width(tablet, '100vw - 48px')}, (max-width: 1200px) ${width(desktop, '100vw - 96px')}, ${Math.round((1104 - (desktop - 1) * 24) / desktop)}px`;
  return (
    <section style={{ padding: `${head ? space : 'var(--uk-space-6)'} 0 ${space}`, background: sand ? 'var(--uk-color-muted-bg)' : undefined, ...sectionColours(p) }}>
      <Container>
        {head ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', columnGap: 24, rowGap: 12, marginBottom: 'var(--uk-space-6)' }}>
            <div>
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              {heading ? <Heading>{heading}</Heading> : null}
            </div>
            {link_label ? <a className="uk-link" href={link_href}>{link_label}</a> : null}
          </div>
        ) : null}
        <Carousel label={heading || undefined} labels={carouselLabels(t)} perView={{ phone, tablet, desktop }} peek={p.peek !== 'off'} loop={p.loop === 'yes'} autoplay={Number(p.autoplay) || undefined}>
          {items.map((x) => (
            <div key={x.id}>
              <ProductCard
                product={x} pricesHidden={hidden} sizes={sizes} level={heading ? 3 : 2} badges={p.card === 'badges' || p.card === 'both'} swap={p.card === 'swap' || p.card === 'both'} swatches={swatches}
                labels={{ was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out'), sale: t('product.sale'), rating: (average, count) => t('product.rated', { average, count }) }}
              />
              {ts.card_quick_add === true ? <QuickAdd product={x} full pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /> : null}
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
