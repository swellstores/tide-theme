import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductStock, sectionProduct } from 'ui-kit';

// A product section's block: the selected variant's stock on a line of its own (in stock, sold out, pre-order,
// backorder), kept with the variant chosen. With it, the price leaves out its own stock word.
export const schema = { label: 'Stock', icon: 'package', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function ProductStockBlock({ t, site, section }: Props) {
  const labels = {
    in_stock: t('product.in_stock'), add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'),
    preorder: t('product.preorder'), backorder: t('product.backorder'),
  };
  return (
    <ProductStock
      product={sectionProduct(section)} labels={labels}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
