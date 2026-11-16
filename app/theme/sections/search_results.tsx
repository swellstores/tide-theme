import { useId } from 'react';
import type { ReactElement } from 'react';
import type { ProductList, SiteInfo, Translate } from 'ui-kit';
import { Container, Heading, Pagination, pricesHiddenFor, ProductCard, QuickAdd, SearchBox, SortSelect } from 'ui-kit';

// The shopper's search: a search box (with the store's suggestions as they type), then the results for their query
// with its count, sort and pages, or the no-results text. The suggestions under the box are the merchant's own links.
// Product cards typed in by hand before (a retired block type) still show after the results. The retired fields held a
// sample query, count and sort.
export const schema = {
  label: 'Search results',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading', retired: true },
    { id: 'search_label', type: 'text', label: 'Search field label', retired: true },
    { id: 'button_label', type: 'text', label: 'Button label', retired: true },
    { id: 'results_label', type: 'text', label: 'Result count ({count} and {query} are filled in)', retired: true },
    { id: 'results_one_label', type: 'text', label: 'Result count for one result', retired: true },
    { id: 'popular_label', type: 'text', label: 'Suggestions label', retired: true },
    {
      id: 'popular', type: 'list', label: 'Suggestions', max: 8,
      item: [
        { id: 'label', type: 'text', label: 'Label' },
        { id: 'href', type: 'url', label: 'Link' },
      ],
      default: [],
    },
    { id: 'columns', type: 'select', label: 'Columns', options: ['3', '4'], default: '3' },
    { id: 'card', type: 'select', label: 'Product cards (badges: sale, sold out; swap: 2nd photo on hover)', options: ['plain', 'badges', 'swap', 'both'], default: 'plain' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 24, default: { from: 'search', limit: 12 } },
    { id: 'empty_label', type: 'text', label: 'No results text', retired: true },
    { id: 'show_sort', type: 'select', label: 'Sort', options: ['show', 'hide'], default: 'show' },
    { id: 'sort_by_label', type: 'text', label: 'Sort label', retired: true },
    { id: 'apply_label', type: 'text', label: 'Apply button', retired: true },
    { id: 'sort_featured', type: 'text', label: 'Sort: best match', retired: true },
    { id: 'sort_best_selling', type: 'text', label: 'Sort: best selling', retired: true },
    { id: 'sort_newest', type: 'text', label: 'Sort: newest', retired: true },
    { id: 'sort_price_asc', type: 'text', label: 'Sort: price, low to high', retired: true },
    { id: 'sort_price_desc', type: 'text', label: 'Sort: price, high to low', retired: true },
    { id: 'sort_name', type: 'text', label: 'Sort: name', retired: true },
    { id: 'was_label', type: 'text', label: 'Sale: word before the old price (for screen readers)', retired: true },
    { id: 'now_label', type: 'text', label: 'Sale: word before the new price (for screen readers)', retired: true },
    { id: 'sold_out_label', type: 'text', label: 'Sold out', retired: true },
    { id: 'pagination_label', type: 'text', label: 'Pages (for screen readers)', retired: true },
    { id: 'prev_label', type: 'text', label: 'Previous page link', retired: true },
    { id: 'next_label', type: 'text', label: 'Next page link', retired: true },
    { id: 'page_label', type: 'text', label: 'Page (for screen readers)', retired: true },
    { id: 'of_label', type: 'text', label: 'Of (for screen readers)', retired: true },
    { id: 'query', type: 'text', label: 'Query', retired: true },
    { id: 'count_label', type: 'text', label: 'Result count', retired: true },
    { id: 'sort_label', type: 'text', label: 'Sort label', retired: true },
    { id: 'source', type: 'select', label: 'Show', options: ['cards', 'store'], retired: true },
  ],
  // Product cards typed in before the section showed the store's results: still shown after them.
  blocks: {
    types: ['product_card'],
    max: 24,
  },
} as const;

type Props = {
  t: Translate;
    popular?: { label?: string; href?: string }[]; columns?: string; card?: string; products?: ProductList | null; show_sort?: string; site?: SiteInfo;
      blocks: ReactElement[];
};

// The box (ui-kit's SearchBox, with the store's suggestions) shows the shopper's query; with results, their count ("{count} results for “{query}”"), the sort and the page
// links (which open the other page at the results: their bar's id, from useId, prefixed by the platform with the
// section's id); after a search with none, the no-results
// text. Without a query, only the box and the suggestions.
export default function SearchResults(p: Props) {
  const { t } = p;
  const anchor = useId();
  const { popular = [], columns = '3', blocks } = p;
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items : [];
  const query = typeof list?.query === 'string' ? list.query : '';
  const countLabel = items.length && query ? t('search.results', { count: list!.total, query }) : '';
  const sort = items.length && p.show_sort !== 'hide' ? (
    <SortSelect
      list={list}
      anchor={anchor}
      labels={{
        label: t('sort.label'), apply: t('common.apply'), featured: t('search.sort_best_match'), best_selling: t('sort.best_selling'), newest: t('sort.newest'),
        price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name'),
      }}
    />
  ) : null;
  const links = popular.filter((s) => s.label && s.href);
  // the theme's store-wide card choices (site.theme_settings; a theme without them: neither): swatch dots, quick add
  const ts = p.site?.theme_settings ?? {};
  const cards = { swatches: typeof ts.card_swatches === 'number' ? Math.max(0, Math.min(8, Math.round(ts.card_swatches))) : 0, quick: ts.card_quick_add === true };
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0' }}>
      <Container>
        {t('search.search') ? <Heading level={1} size="lg">{t('search.search')}</Heading> : null}
        <SearchBox query={query} labels={{ field: t('search.field'), button: t('search.search') }} />
        {links.length ? (
          <div className="uk-cluster" style={{ gap: 8, marginTop: 'var(--uk-space-4)' }}>
            {t('search.popular') ? <span style={{ marginRight: 4, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{t('search.popular')}</span> : null}
            {links.map((s, i) => (
              <a key={i} href={s.href} className="uk-chip">{s.label}</a>
            ))}
          </div>
        ) : null}
        {countLabel || sort ? (
          <div id={anchor} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, margin: 'var(--uk-space-7) 0 var(--uk-space-6)', paddingBottom: 'var(--uk-space-4)', borderBottom: '1px solid var(--uk-color-line)' }}>
            {countLabel ? (
              <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{countLabel}</p>
            ) : <span />}
            {sort}
          </div>
        ) : null}
        {!items.length && t('search.empty') && query ? (
          <p style={{ margin: 'var(--uk-space-7) 0 0', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('search.empty')}</p>
        ) : null}
        {items.length || blocks.length ? (
          <ul className={columns === '4' ? 'uk-grid uk-grid--4 uk-grid--products' : 'uk-grid uk-grid--3 uk-grid--products'} style={{ marginTop: countLabel || sort ? undefined : 'var(--uk-space-7)' }}>
            {items.map((x) => <li key={x.id}><ProductCard product={x} pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out'), sale: t('product.sale') }} columns={columns === '4' ? 4 : 3} badges={p.card === 'badges' || p.card === 'both'} swap={p.card === 'swap' || p.card === 'both'} swatches={cards.swatches} />{cards.quick ? <QuickAdd product={x} full pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /> : null}</li>)}
            {blocks.map((b) => <li key={b.key}>{b}</li>)}
          </ul>
        ) : null}
        {list && list.pages > 1 && (list.prev_url || list.next_url) ? (
          <div style={{ marginTop: 'var(--uk-space-7)' }}>
            <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={countLabel || sort ? anchor : undefined} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
