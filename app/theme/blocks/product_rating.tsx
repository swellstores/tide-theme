import type { SectionContext, Translate } from 'ui-kit';
import { sectionProduct, Stars } from 'ui-kit';

// A product section's block: the product's stars and review count, only from an installed reviews app
// (ProductData.rating); nothing without one. Its look is ui-kit.css's .uk-product-rating, so a section's styles can
// change it.
export const schema = { label: 'Rating', icon: 'star', fields: [] } as const;

type Props = { t: Translate; section?: SectionContext };

export default function ProductRating({ t, section }: Props) {
  const item = sectionProduct(section);
  const rating = item?.rating && t('product.rating') ? item.rating : null;
  if (!rating) return null;
  return (
    <p className="uk-product-rating">
      <Stars average={rating.average} size={16} />
      {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: rating.count })}
    </p>
  );
}
