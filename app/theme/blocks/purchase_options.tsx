import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductPurchase, sectionProduct } from 'ui-kit';

// A product section's block: how to buy the product, one-time or by subscription (each plan's price follows the
// variant chosen) or after a trial. Nothing for a product sold only once.
export const schema = { label: 'Purchase options', icon: 'calendar', fields: [] } as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext };

export default function PurchaseOptions({ t, site, section }: Props) {
  const labels = {
    purchase: t('product.purchase_options'), one_time: t('product.one_time'), subscribe: t('product.subscribe'), trial: t('product.trial'),
    save: (percent: number) => t('product.save', { percent }), delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  return (
    <ProductPurchase
      product={sectionProduct(section)} labels={labels} locale={site?.locale}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
