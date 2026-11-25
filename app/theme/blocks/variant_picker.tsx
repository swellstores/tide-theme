import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductOptions, sectionProduct } from 'ui-kit';

// A product section's block: the product's options (sizes, colors, text and add-on choices), in its section's one
// product form wherever this block sits. Nothing for a product without options.
export const schema = { label: 'Variant picker', icon: 'list', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function VariantPicker({ t, site, section }: Props) {
  return (
    <ProductOptions
      product={sectionProduct(section)} labels={{ unavailable: t('product.unavailable') }}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
