import type { SectionContext, Translate } from 'ui-kit';
import { sectionProduct } from 'ui-kit';

// A product section's block: a bundle's items (how many of each, linked when sold on their own). Nothing for a product
// that isn't a bundle.
export const schema = { label: 'Bundle items', icon: 'package', fields: [] } as const;

type Props = { t: Translate; section?: SectionContext };

export default function BundleItems({ t, section }: Props) {
  const item = sectionProduct(section);
  if (!item?.bundle.length || !t('product.bundle')) return null;
  return (
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
  );
}
