import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductQuantity, sectionProduct } from 'ui-kit';

// A product section's block: the quantity box, from the product's least quantity in its steps.
export const schema = { label: 'Quantity', icon: 'block', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function ProductQuantityBlock({ t, site, section }: Props) {
  return (
    <ProductQuantity
      product={sectionProduct(section)} label={t('common.quantity')}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
