import type { ReactElement } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Heading, Icon, Image, pricesHiddenFor, ProductForm, RichText, SellList } from 'ui-kit';

// Everything about the product comes from the store: its name, photos, price, options, stock, attributes, purchase
// options, bundle items, category and rating. The fields here are the merchant's own promises and notes; fixed words
// come from Store text. The retired fields held a hand-made product (name, price, photos, colors,
// sizes, reviews, specifications, links) or a badge every product would show: templates that still hold them save and
// render, and they are not shown.
export const schema = {
  label: 'Product details',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'home_label', type: 'text', label: 'Breadcrumb: home link', retired: true },
    { id: 'breadcrumb_label', type: 'text', label: 'Breadcrumb name (for screen readers)', retired: true },
    { id: 'cta_label', type: 'text', label: 'Add to cart button', retired: true },
    { id: 'sold_out_label', type: 'text', label: 'Button when sold out', retired: true },
    { id: 'unavailable_label', type: 'text', label: 'Button when not for sale', retired: true },
    { id: 'preorder_label', type: 'text', label: 'Button for a pre-order', retired: true },
    { id: 'backorder_label', type: 'text', label: 'Button for a backorder', retired: true },
    { id: 'was_label', type: 'text', label: 'Sale: word before the old price (for screen readers)', retired: true },
    { id: 'now_label', type: 'text', label: 'Sale: word before the new price (for screen readers)', retired: true },
    { id: 'quantity_label', type: 'text', label: 'Quantity label (empty: no quantity box)', retired: true },
    { id: 'show_quantity', type: 'select', label: 'Quantity box', options: ['show', 'hide'], default: 'show' },
    { id: 'purchase_label', type: 'text', label: 'Purchase options heading', retired: true },
    { id: 'one_time_label', type: 'text', label: 'One-time purchase', retired: true },
    { id: 'subscribe_label', type: 'text', label: 'Subscription', retired: true },
    { id: 'trial_label', type: 'text', label: 'Trial', retired: true },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], default: 'show' },
    { id: 'bundle_label', type: 'text', label: 'Bundle items heading', retired: true },
    { id: 'rating_label', type: 'text', label: 'Rating ({average} and {count} are filled in)', retired: true },
    {
      id: 'points', type: 'list', label: 'Promises', max: 4,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['truck', 'return', 'shield', 'leaf', 'clock', 'check'], default: 'check' },
        { id: 'text', type: 'text', label: 'Text' },
      ],
      default: [],
    },
    {
      id: 'details', type: 'list', label: 'Details on every product (put product facts in its description or attributes)', max: 6,
      item: [
        { id: 'title', type: 'text', label: 'Title' },
        { id: 'body', type: 'textarea', label: 'Text' },
      ],
      default: [],
    },
    { id: 'breadcrumbs', type: 'list', label: 'Breadcrumb', retired: true, item: [{ id: 'label', type: 'text' }, { id: 'href', type: 'url' }] },
    { id: 'title', type: 'text', label: 'Product name', retired: true },
    { id: 'rating', type: 'text', label: 'Stars', retired: true },
    { id: 'reviews_label', type: 'text', label: 'Reviews label', retired: true },
    { id: 'reviews_href', type: 'url', label: 'Reviews link', retired: true },
    { id: 'price', type: 'text', label: 'Price', retired: true },
    { id: 'price_note', type: 'text', label: 'Price note', retired: true },
    { id: 'description', type: 'textarea', label: 'Description', retired: true },
    { id: 'quick_specs', type: 'list', label: 'Key specifications', retired: true, item: [{ id: 'label', type: 'text' }, { id: 'value', type: 'text' }] },
    { id: 'image', type: 'image', label: 'Image', retired: true },
    { id: 'artwork', type: 'text', label: 'Artwork', retired: true },
    { id: 'colour_label', type: 'text', label: 'Color label', retired: true },
    { id: 'colours', type: 'list', label: 'Colors', retired: true, item: [{ id: 'swatch', type: 'text' }, { id: 'name', type: 'text' }] },
    { id: 'size_label', type: 'text', label: 'Size label', retired: true },
    { id: 'sizes', type: 'list', label: 'Sizes', retired: true, item: [{ id: 'label', type: 'text' }] },
    { id: 'selected_size', type: 'text', label: 'Selected size', retired: true },
    { id: 'cta_href', type: 'url', label: 'Button link', retired: true },
    { id: 'badge', type: 'text', label: 'Badge', retired: true },
  ],
  blocks: { types: ['text'], max: 4 },
} as const;

type Props = {
  blocks?: ReactElement[]; // core text blocks, under the buy box
  t: Translate; show_quantity?: string; pairs?: ProductList | null;
  product?: ProductData | null; site?: SiteInfo;     show_attributes?: string;   points?: { icon?: 'truck' | 'return' | 'shield' | 'leaf' | 'clock' | 'check'; text?: string }[]; details?: { title?: string; body?: string }[];
};

// The gallery: the selected variant's photo (else the product's first) large, marked for the platform script, which
// swaps it for the chosen variant's; then every photo of the product, wrapping; a plain tile without one. Beside it:
// the trail Home › category › product, the name, the rating (only with a reviews app's), the add-to-cart form (the
// page's own: the selected variant's price, every option, stock states, purchase options, quantity), the description,
// the bundle's items, the attributes, then the merchant's promises and notes. Nothing without a product. Only the
// page's own product (its address is the page's) has the page's heading (h1) and the primary form (the one whose
// choice goes into the address); another product shown here has an h2. Each thumbnail links to its photo, which the
// platform script shows in the large image instead (data-site-photo); its name is the photo's caption (its alt, when that
// is not the product's name), else "Photo 2" in the store's words.
export default function ProductDetails(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  // no product: the merchant's text blocks alone
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const main = item.selected?.image ?? item.image;
  const photos = Array.isArray(item.images) ? item.images : [];
  const points = (p.points ?? []).filter((pt) => pt.text);
  const details = (p.details ?? []).filter((d) => d.title || d.body);
  const attributes = p.show_attributes === 'hide' ? [] : item.attributes.filter((a) => a.values.length);
  const rating = item.rating && t('product.rating') ? item.rating : null;
  const labels = {
    add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder'),
    was: t('product.was'), now: t('product.now'), quantity: p.show_quantity === 'hide' ? '' : t('common.quantity'), purchase: t('product.purchase_options'), one_time: t('product.one_time'),
    subscribe: t('product.subscribe'), trial: t('product.trial'), save: (percent: number) => t('product.save', { percent }),
    delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-space-8)' }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 'clamp(32px, 6vw, 72px)', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 'calc(var(--uk-header-sticky, 0px) + 24px)' }}>
            <div className="uk-media" style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
              {main ? (
                <Image image={main} sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(50.3vw - 51px), 552px" priority variantImage />
              ) : (
                <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={72} /></span>
              )}
            </div>
            {photos.length > 1 ? (
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 12, margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                {photos.map((ph, i) => (
                  <li key={i}>
                    <a href={ph.url} data-site-photo="" aria-current={ph.url === main?.url ? 'true' : undefined} className="uk-media" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--uk-radius-sm)' }}>
                      <Image image={ph} alt={ph.alt && ph.alt !== item.name ? ph.alt : t('product.photo', { number: i + 1 }) || `${item.name} ${i + 1}`} sizes="120px" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div style={{ display: 'grid', gap: 'var(--uk-space-5)', paddingTop: 4 }}>
            <div>
              <div style={{ marginBottom: 'var(--uk-space-3)' }}>
                <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
              </div>
              <Heading level={own ? 1 : 2} size="xl">{item.name}</Heading>
              {rating ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '-4px 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
                  <span aria-hidden="true" style={{ display: 'inline-flex', gap: 2, color: 'var(--uk-color-highlight)' }}>
                    {Array.from({ length: Math.round(Math.min(5, Math.max(0, rating.average))) }, (_, i) => <Icon key={i} name="star" size={16} />)}
                  </span>
                  {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: String(rating.count) })}
                </p>
              ) : null}
            </div>
            <ProductForm product={item} labels={labels} primary={own} locale={p.site?.locale} pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} />
            {p.blocks}
            {p.pairs?.items?.length ? (
              <div>
                {t('product.pairs_with') ? <h2 style={{ margin: '0 0 var(--uk-space-3)', fontSize: 'var(--uk-text-sm)', fontWeight: 700, color: 'var(--uk-color-heading)' }}>{t('product.pairs_with')}</h2> : null}
                <SellList list={p.pairs} pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
              </div>
            ) : null}
            {item.description.length ? (
              <div style={{ fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}><RichText value={item.description} /></div>
            ) : null}
            {item.bundle.length && t('product.bundle') ? (
              <div>
                <h2 style={{ margin: '0 0 var(--uk-space-2)', fontSize: 'var(--uk-text-sm)', fontWeight: 700, color: 'var(--uk-color-heading)' }}>{t('product.bundle')}</h2>
                <ul style={{ display: 'grid', gap: 6, margin: 0, padding: 0, listStyle: 'none', fontSize: 'var(--uk-text-sm)' }}>
                  {item.bundle.map((b, i) => (
                    <li key={i}>
                      {`${b.quantity} × `}
                      {b.url ? <a href={b.url} style={{ color: 'inherit', textUnderlineOffset: 3 }}>{b.name}</a> : b.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {attributes.length ? (
              <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--uk-space-4)', margin: 0, padding: 'var(--uk-space-4) 0', borderTop: '1px solid var(--uk-color-line)', borderBottom: '1px solid var(--uk-color-line)' }}>
                {attributes.map((a) => (
                  <div key={a.id}>
                    <dt style={{ fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-muted)' }}>{a.name}</dt>
                    <dd style={{ margin: 'var(--uk-space-1) 0 0', fontSize: 'var(--uk-text-md)', fontWeight: 600, color: 'var(--uk-color-heading)' }}>{a.values.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {points.length ? (
              <ul style={{ display: 'grid', gap: 'var(--uk-space-3)', margin: 0, padding: 'var(--uk-space-4)', background: 'var(--uk-color-muted-bg)', borderRadius: 'var(--uk-radius-md)', listStyle: 'none', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
                {points.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 'none', display: 'inline-grid', color: 'var(--uk-color-accent)' }}><Icon name={pt.icon ?? 'check'} size={18} /></span>
                    {pt.text}
                  </li>
                ))}
              </ul>
            ) : null}
            {details.length ? (
              <div style={{ borderTop: '1px solid var(--uk-color-line)' }}>
                {details.map((d, i) => (
                  <details key={i} className="uk-disclosure" open={i === 0}>
                    <summary>
                      {d.title}
                      <Icon name="chevron" size={18} />
                    </summary>
                    <p>{d.body}</p>
                  </details>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
