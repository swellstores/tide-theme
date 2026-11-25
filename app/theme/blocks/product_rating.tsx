import type { SectionContext, Translate } from 'ui-kit';
import { sectionProduct, Stars } from 'ui-kit';

// A product section's block: the product's stars and review count, only from an installed reviews app
// (ProductData.rating); nothing without one.
export const schema = { label: 'Rating', icon: 'star', fields: [] } as const;

type Props = { t: Translate; section?: SectionContext };

export default function ProductRating({ t, section }: Props) {
  const item = sectionProduct(section);
  const rating = item?.rating && t('product.rating') ? item.rating : null;
  if (!rating) return null;
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '-4px 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
      <Stars average={rating.average} size={16} />
      {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: rating.count })}
    </p>
  );
}
