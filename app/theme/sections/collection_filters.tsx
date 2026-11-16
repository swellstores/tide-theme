import { Container, safeUrl } from 'ui-kit';
import type { SiteInfo } from 'ui-kit';

// Retired: the product grid shows a collection's own filters, sort and count. Links stored here before that still
// render as chips (the one to the page shown is marked from the page's address) until the section is replaced; the
// count, sort and filter labels typed in by hand are no longer shown.
export const schema = {
  label: 'Collection filters',
  retired: true,
  fields: [
    {
      id: 'filters', type: 'list', label: 'Links', max: 10,
      item: [
        { id: 'label', type: 'text', label: 'Label' },
        { id: 'href', type: 'url', label: 'Link' },
      ],
    },
    { id: 'count_label', type: 'text', label: 'Product count', retired: true },
    { id: 'filter_label', type: 'text', label: 'Filter button', retired: true },
    { id: 'active', type: 'text', label: 'Selected filter', retired: true },
    { id: 'sort_label', type: 'text', label: 'Sort label', retired: true },
  ],
} as const;

type Props = { filters?: { label?: string; href?: string }[]; site?: SiteInfo };

export default function CollectionFilters({ filters = [], site }: Props) {
  const links = filters.map((f) => ({ label: f.label, href: safeUrl(f.href) })).filter((f) => f.label && f.href);
  if (!links.length) return null;
  return (
    <div style={{ borderTop: '1px solid var(--uk-color-line)', borderBottom: '1px solid var(--uk-color-line)' }}>
      <Container>
        <ul style={{ display: 'flex', gap: 8, margin: 0, padding: '16px 0', overflowX: 'auto', scrollbarWidth: 'none', listStyle: 'none' }}>
          {links.map((f, i) => {
            const current = f.href === site?.page.path;
            return (
              <li key={i}>
                <a href={f.href} aria-current={current ? 'page' : undefined} className={current ? 'uk-chip uk-chip--active' : 'uk-chip'}>{f.label}</a>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
