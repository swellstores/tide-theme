import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductPrice, sectionProduct } from 'ui-kit';

// A product section's block: the selected variant's price (a sale's two prices; the plan's or the trial's for a product
// bought only that way), and its stock state when it isn't in stock. The platform script keeps it with the variant chosen.
export const schema = { label: 'Price', icon: 'tag', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function ProductPriceBlock({ t, site, section }: Props) {
  const labels = {
    add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder'),
    was: t('product.was'), now: t('product.now'),
  };
  return (
    <ProductPrice
      product={sectionProduct(section)} labels={labels} locale={site?.locale}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
