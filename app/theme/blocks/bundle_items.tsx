import type { SectionContext, Translate } from 'ui-kit';
import { sectionProduct } from 'ui-kit';

// A product section's block: a bundle's items (how many of each, linked when sold on their own). Nothing for a product
// that isn't a bundle. Its looks are ui-kit.css's .uk-bundle-heading and .uk-bundle-items, so a section's styles can
// change them.
export const schema = { label: 'Bundle items', icon: 'package', fields: [] } as const;

type Props = { t: Translate; section?: SectionContext };

export default function BundleItems({ t, section }: Props) {
  const item = sectionProduct(section);
  if (!item?.bundle.length || !t('product.bundle')) return null;
  return (
    <div>
      <h2 className="uk-bundle-heading">{t('product.bundle')}</h2>
      <ul className="uk-bundle-items">
        {item.bundle.map((b, i) => (
          <li key={i}>
            {`${b.quantity} × `}
            {b.url ? <a href={b.url}>{b.name}</a> : b.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
