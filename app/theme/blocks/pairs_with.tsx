import type { ProductList, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, SellList } from 'ui-kit';

// A product section's block: products that go with it (its up-sells by default), each with one-click add. Its
// heading's look is ui-kit.css's .uk-pairs-heading, so a section's styles can change it.
export const schema = {
  label: 'Pairs with',
  icon: 'grid',
  fields: [
    { id: 'products', type: 'product_list', label: 'Products (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
  ],
} as const;

type Props = { t: Translate; site?: SiteInfo; products?: ProductList | null };

export default function PairsWith({ t, site, products }: Props) {
  if (!products?.items?.length) return null;
  const hidden = pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page });
  return (
    <div>
      {t('product.pairs_with') ? <h2 className="uk-pairs-heading">{t('product.pairs_with')}</h2> : null}
      <SellList list={products} pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
    </div>
  );
}
