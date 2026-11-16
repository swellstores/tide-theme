import { useId } from 'react';
import type { ReactElement } from 'react';
import type { ProductList, SiteInfo, Translate } from 'ui-kit';
import { ActiveFilters, Container, Eyebrow, FilterForm, Heading, Icon, Pagination, pricesHiddenFor, ProductCard, QuickAdd, sectionColours, SortSelect } from 'ui-kit';

// The store's products (Store products). On a collection page's own list it also shows the list's count, sort, filters
// and pages, all plain forms and links that work without scripts (a sort, a filter or another page opens at the list:
// its id, from useId, which the platform prefixes with the section's id, so two grids never share one).
// Product cards typed in by hand before (a retired block type) still show after the store's products.
export const schema = {
  label: 'Product grid',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Products' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'View all' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'columns', type: 'select', label: 'Columns', options: ['4', '3'], default: '4' },
    { id: 'card', type: 'select', label: 'Product cards (badges: sale, sold out; swap: 2nd photo on hover)', options: ['plain', 'badges', 'swap', 'both'], default: 'plain' },
    { id: 'tone', type: 'select', label: 'Background', options: ['page', 'sand'], default: 'page' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 24, filters: true, default: { from: 'all', sort: 'best_selling', limit: 4 } },
    { id: 'count_label', type: 'text', label: 'Product count ({count} is filled in; empty: no count)', retired: true },
    { id: 'count_one_label', type: 'text', label: 'Product count for one product', retired: true },
    { id: 'show_count', type: 'select', label: 'Product count', options: ['show', 'hide'], default: 'show' },
    { id: 'show_sort', type: 'select', label: 'Sort', options: ['show', 'hide'], default: 'show' },
    { id: 'sort_by_label', type: 'text', label: 'Sort label', retired: true },
    { id: 'sort_featured', type: 'text', label: 'Sort: featured', retired: true },
    { id: 'sort_best_selling', type: 'text', label: 'Sort: best selling', retired: true },
    { id: 'sort_newest', type: 'text', label: 'Sort: newest', retired: true },
    { id: 'sort_price_asc', type: 'text', label: 'Sort: price, low to high', retired: true },
    { id: 'sort_price_desc', type: 'text', label: 'Sort: price, high to low', retired: true },
    { id: 'sort_name', type: 'text', label: 'Sort: name', retired: true },
    { id: 'show_filters', type: 'select', label: 'Filters', options: ['show', 'hide'], default: 'show' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
    { id: 'filters_label', type: 'text', label: 'Filters button', retired: true },
    { id: 'apply_label', type: 'text', label: 'Apply button', retired: true },
    { id: 'min_label', type: 'text', label: 'Price range: lowest', retired: true },
    { id: 'max_label', type: 'text', label: 'Price range: highest', retired: true },
    { id: 'count_word', type: 'text', label: 'Word after a filter count (for screen readers)', retired: true },
    { id: 'remove_label', type: 'text', label: 'Word before a chosen filter (for screen readers)', retired: true },
    { id: 'empty_label', type: 'text', label: 'No products for the chosen filters', retired: true },
    { id: 'no_products_label', type: 'text', label: 'A category with no products', retired: true },
    { id: 'was_label', type: 'text', label: 'Sale: word before the old price (for screen readers)', retired: true },
    { id: 'now_label', type: 'text', label: 'Sale: word before the new price (for screen readers)', retired: true },
    { id: 'sold_out_label', type: 'text', label: 'Sold out', retired: true },
    { id: 'pagination_label', type: 'text', label: 'Pages (for screen readers)', retired: true },
    { id: 'prev_label', type: 'text', label: 'Previous page link', retired: true },
    { id: 'next_label', type: 'text', label: 'Next page link', retired: true },
    { id: 'page_label', type: 'text', label: 'Page (for screen readers)', retired: true },
    { id: 'of_label', type: 'text', label: 'Of (for screen readers)', retired: true },
    { id: 'source', type: 'select', label: 'Show', options: ['cards', 'store'], retired: true },
  ],
  // Product cards typed in before the grid showed the store's products: still shown after them.
  blocks: {
    types: ['product_card'],
    max: 16,
  },
} as const;

type Props = {
  t: Translate; show_count?: string; card?: string;
  eyebrow?: string; heading?: string; link_label?: string; link_href?: string; columns?: string; tone?: string; products?: ProductList | null;
  show_sort?: string;   show_filters?: string; background_colour?: string; text_colour?: string; accent_colour?: string; site?: SiteInfo;         blocks: ReactElement[];
};

// The page's own list (a collection's, which has sort options) gets a bar with its count and sort, its filters behind a
// Filter disclosure (closed even while filters are chosen, so a filtered page opens at its products; the chosen filters'
// removal links show below it), the no-results text when the chosen filters match nothing, and its page links; with no
// products at all, only its no-products text. Another list shows nothing without products or cards.
export default function ProductGrid(p: Props) {
  const { t } = p;
  const anchor = useId();
  const { eyebrow, heading, link_label, link_href, columns = '4', tone = 'page', blocks } = p;
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items : [];
  const main = !!list && Array.isArray(list.sort_options) && list.sort_options.length > 0;
  const chosen = main && Array.isArray(list.active_filters) ? list.active_filters.length : 0;
  const none = !items.length && !blocks.length && !chosen;
  if (none && (!main || !t('collection.empty'))) return null;
  const countText = main && p.show_count !== 'hide' ? t('collection.count', { count: list.total }) : '';
  const filters = main && !none && p.show_filters !== 'hide' && (list.filters.length > 0 || chosen > 0);
  const fold = filters && !!t('filter.button');
  const form = filters ? (
    <FilterForm list={list} labels={{ apply: t('common.apply'), min: t('filter.min'), max: t('filter.max'), count: t('filter.count_word'), remove: t('filter.remove') }} anchor={anchor} active={!fold} />
  ) : null;
  const head = eyebrow || heading || link_label;
  const sand = tone === 'sand';
  const space = sand ? 'var(--uk-section-md)' : 'var(--uk-section-sm)';
  // the theme's store-wide card choices (site.theme_settings; a theme without them: neither): swatch dots, quick add
  const ts = p.site?.theme_settings ?? {};
  const cards = { swatches: typeof ts.card_swatches === 'number' ? Math.max(0, Math.min(8, Math.round(ts.card_swatches))) : 0, quick: ts.card_quick_add === true };
  return (
    <section id={main ? anchor : undefined} style={{ padding: `${head ? space : 'var(--uk-space-6)'} 0 ${space}`, background: sand ? 'var(--uk-color-muted-bg)' : undefined, ...sectionColours(p) }}>
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
        {none ? <p style={{ margin: 0, fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('collection.empty')}</p> : null}
        {main && !none ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingBottom: 'var(--uk-space-4)', borderBottom: '1px solid var(--uk-color-line)' }}>
            {countText ? <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{countText}</p> : <span />}
            {p.show_sort !== 'hide' ? (
              <SortSelect
                list={list}
                anchor={anchor}
                labels={{
                  label: t('sort.label'), apply: t('common.apply'), featured: t('sort.featured'), best_selling: t('sort.best_selling'), newest: t('sort.newest'),
                  price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name'),
                }}
              />
            ) : null}
          </div>
        ) : null}
        {form && fold ? (
          <>
            <details className="uk-disclosure">
              <summary>
                {chosen ? `${t('filter.button')} (${chosen})` : t('filter.button')}
                <Icon name="chevron" size={18} />
              </summary>
              <div style={{ maxWidth: 560 }}>{form}</div>
            </details>
            <ActiveFilters list={list} labels={{ remove: t('filter.remove') }} anchor={anchor} />
          </>
        ) : form ? <div style={{ padding: 'var(--uk-space-4) 0' }}>{form}</div> : null}
        {items.length || blocks.length ? (
          <ul className={columns === '3' ? 'uk-grid uk-grid--3 uk-grid--products' : 'uk-grid uk-grid--4 uk-grid--products'} style={{ marginTop: main ? 'var(--uk-space-6)' : undefined }}>
            {items.map((x, i) => <li key={x.id}><ProductCard product={x} pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out'), sale: t('product.sale') }} level={heading ? 3 : 2} columns={columns === '3' ? 3 : 4} priority={main && i < (columns === '3' ? 3 : 4)} badges={p.card === 'badges' || p.card === 'both'} swap={p.card === 'swap' || p.card === 'both'} swatches={cards.swatches} />{cards.quick ? <QuickAdd product={x} full pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /> : null}</li>)}
            {blocks.map((b) => <li key={b.key}>{b}</li>)}
          </ul>
        ) : !none && t('filter.empty') ? (
          <p style={{ margin: 'var(--uk-space-7) 0 0', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('filter.empty')}</p>
        ) : null}
        {main && list.pages > 1 && (list.prev_url || list.next_url) ? (
          <div style={{ marginTop: 'var(--uk-space-7)' }}>
            <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
