import type { ReactElement } from 'react';
import type { ProductData, SiteInfo, Translate } from 'ui-kit';
import { Container, Icon, Image, pricesHiddenFor, ProductInfo } from 'ui-kit';

// Everything about the product comes from the store: its name, photos, price, options, stock, attributes, purchase
// options, bundle items, category and rating. The info column beside the photos is blocks (2026-11-25), in the order the
// merchant sets: the trail, name, rating, price, variant picker, purchase options, quantity and buy buttons share one
// product form wherever they sit (ui-kit ProductInfo), and the description, specifications, collapsible rows, text,
// promises, up-sells, add-ons and app blocks go anywhere between them. The buy buttons can be hidden, never removed. The retired
// fields held a hand-made product (name, price, photos, colors, sizes, reviews, specifications, links), a badge every
// product would show, or what blocks hold now (the quantity box, attributes, up-sells, promises and details: a template
// from before blocks gets them as blocks, blocks-migrate.ts); templates that still hold them save and render, and they
// are not shown.
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
    { id: 'show_quantity', type: 'select', label: 'Quantity box', options: ['show', 'hide'], retired: true },
    { id: 'purchase_label', type: 'text', label: 'Purchase options heading', retired: true },
    { id: 'one_time_label', type: 'text', label: 'One-time purchase', retired: true },
    { id: 'subscribe_label', type: 'text', label: 'Subscription', retired: true },
    { id: 'trial_label', type: 'text', label: 'Trial', retired: true },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, retired: true },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], retired: true },
    { id: 'bundle_label', type: 'text', label: 'Bundle items heading', retired: true },
    { id: 'rating_label', type: 'text', label: 'Rating ({average} and {count} are filled in)', retired: true },
    {
      id: 'points', type: 'list', label: 'Promises', max: 4, retired: true,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['truck', 'return', 'shield', 'leaf', 'clock', 'check'], default: 'check' },
        { id: 'text', type: 'text', label: 'Text' },
      ],
    },
    {
      id: 'details', type: 'list', label: 'Details on every product (put product facts in its description or attributes)', max: 6, retired: true,
      item: [
        { id: 'title', type: 'text', label: 'Title' },
        { id: 'body', type: 'textarea', label: 'Text' },
      ],
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
  blocks: {
    types: [
      'product_breadcrumbs', 'product_title', 'product_rating', 'product_price', 'variant_picker', 'purchase_options', 'product_quantity', 'add_to_cart',
      'product_description', 'product_specs', 'product_stock', 'collapsible_row', 'text', 'pairs_with', 'bundle_items', 'promises', 'product_addons', 'app_block',
    ],
    max: 30,
    default: [
      { type: 'product_breadcrumbs' }, { type: 'product_title' }, { type: 'product_rating' }, { type: 'product_price' }, { type: 'variant_picker' },
      { type: 'purchase_options' }, { type: 'product_quantity' }, { type: 'add_to_cart' }, { type: 'pairs_with', props: { products: { from: 'up_sells', limit: 3 } } },
      { type: 'product_description' }, { type: 'bundle_items' }, { type: 'product_specs' },
    ],
    required: ['add_to_cart'],
    // a template from before blocks: its old settings as blocks (blocks-migrate.ts)
    migrate: [
      { block: 'product_quantity', when: { show_quantity: 'hide' }, hide: true },
      { block: 'product_specs', when: { show_attributes: 'hide' }, hide: true },
      { block: 'pairs_with', props: { products: 'pairs' } },
      { add: 'promises', props: { points: 'points' }, after: 'product_specs' },
      { add: 'collapsible_row', items: 'details', props: { title: 'title', text: 'body' }, set: { open: 'closed' }, first: { open: 'open' }, after: 'product_specs' },
    ],
  },
} as const;

// The Title block's heading has no margin in a product column (ui-kit.css); here it keeps its room above the rating or
// whatever follows it in the heading.
export const styles = `
& .uk-product-head > [data-block-type="product_title"]:has(~ [data-block]:not(:empty)) > .uk-heading:last-child { margin-bottom: .45em; }
`;

type Props = { blocks?: ReactElement[]; t: Translate; product?: ProductData | null; site?: SiteInfo };

// The gallery: the selected variant's photo (else the product's first) large, marked for the platform script, which
// swaps it for the chosen variant's; then every photo of the product, wrapping; a plain tile without one. Beside it:
// the info column of blocks (ProductInfo: one product form for them all). Nothing but the blocks without a product.
// Only the page's own product (its address is the page's) has the page's heading (h1, the Title block's) and the primary
// form (the one whose choice goes into the address). Each thumbnail links to its photo, which the platform script shows
// in the large image instead (data-site-photo); its name is the photo's caption (its alt, when that is not the product's
// name), else "Photo 2" in the store's words.
export default function ProductDetails(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const main = item.selected?.image ?? item.image;
  const photos = Array.isArray(item.images) ? item.images : [];
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-space-8)' }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 'clamp(32px, 6vw, 72px)', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 'calc(var(--uk-header-sticky, 0px) + 24px)' }}>
            <div className="uk-media" style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
              {main ? (
                <Image image={main} sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(50.3vw - 51px), 552px" priority variantImage />
              ) : (
                <span className='uk-media-icon' style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={72} /></span>
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
          <ProductInfo
            product={item} primary={own} locale={p.site?.locale} blocks={p.blocks} style={{ paddingTop: 4 }}
            pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })}
          />
        </div>
      </Container>
    </section>
  );
}
