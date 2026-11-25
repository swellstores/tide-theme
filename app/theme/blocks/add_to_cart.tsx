import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductBuyButton, sectionProduct } from 'ui-kit';

// A product section's block: the add-to-cart button, in the selection's words (sold out, pre-order, backorder). Its
// section always keeps it (schema.blocks.required): it can be hidden, never deleted.
export const schema = { label: 'Buy buttons', icon: 'cart', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function AddToCart({ t, site, section }: Props) {
  const labels = { add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder') };
  return (
    <ProductBuyButton
      product={sectionProduct(section)} labels={labels}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
