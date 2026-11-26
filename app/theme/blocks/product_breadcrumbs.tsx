import type { SectionContext, Translate } from 'ui-kit';
import { Breadcrumbs, sectionProduct } from 'ui-kit';

// A product section's block: the trail Home › the product's category › the product, from the store. Nothing outside a
// product section. Its room below is ui-kit.css's .uk-product-trail, so a section's styles can change it.
export const schema = { label: 'Breadcrumbs', icon: 'text', fields: [] } as const;

type Props = { t: Translate; section?: SectionContext };

export default function ProductBreadcrumbs({ t, section }: Props) {
  const item = sectionProduct(section);
  if (!item) return null;
  return (
    <div className="uk-product-trail">
      <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
    </div>
  );
}
