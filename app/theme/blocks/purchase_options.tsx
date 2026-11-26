import type { SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, ProductPurchase, sectionProduct } from 'ui-kit';

// A product section's block: how to buy the product, one-time or by subscription (each plan's price follows the
// variant chosen) or after a trial. Nothing for a product sold only once. first: the choice the radios start on (the
// radios are what the column's form sends, so the form agrees); savings: the Subscribe choice's badge with its best
// plan's savings.
export const schema = {
  label: 'Purchase options',
  icon: 'calendar',
  fields: [
    { id: 'first', type: 'select', label: 'Chosen first', options: ['one_time', 'subscribe'], default: 'one_time' },
    { id: 'savings', type: 'select', label: 'Savings badge', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext; first?: 'one_time' | 'subscribe'; savings?: 'show' | 'hide' };

export default function PurchaseOptions({ t, site, section, first, savings }: Props) {
  const labels = {
    purchase: t('product.purchase_options'), one_time: t('product.one_time'), subscribe: t('product.subscribe'), trial: t('product.trial'),
    save: savings === 'hide' ? undefined : (percent: number) => t('product.save', { percent }), delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  return (
    <ProductPurchase
      product={sectionProduct(section)} labels={labels} locale={site?.locale} purchaseDefault={first === 'subscribe' ? 'subscription' : 'standard'}
      pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
    />
  );
}
