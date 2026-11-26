import type { ProductList, SectionContext, SiteInfo, Translate } from 'ui-kit';
import { pricesHiddenFor, productFormId, quickAddable, sectionProduct } from 'ui-kit';

// A product section's block: tick boxes that add other products (its cross-sells by default) with it, in the column's
// product form (form=), as a product form's own add-ons: only products that add in one click, never the product
// itself, at most two. Nothing without any, or while prices are hidden.
export const schema = {
  label: 'Add-ons',
  icon: 'list',
  fields: [
    { id: 'products', type: 'product_list', label: 'Add-ons (the product\'s cross-sells)', max: 2, default: { from: 'cross_sells', limit: 2 } },
  ],
} as const;

type Props = { t: Translate; site?: SiteInfo; section?: SectionContext; products?: ProductList | null };

export default function ProductAddons({ t, site, section, products }: Props) {
  const item = sectionProduct(section);
  if (!item || pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })) return null;
  const list = (products?.items ?? []).filter((a) => a && typeof a.id === 'string' && a.id !== item.id && quickAddable(a)).slice(0, 2);
  if (!list.length) return null;
  return (
    <fieldset className="uk-option uk-addons">
      {t('product.addons') ? <legend className="uk-label">{t('product.addons')}</legend> : null}
      {list.map((a) => (
        <label key={a.id} className="uk-check">
          <input type="checkbox" name="addon" value={a.id} form={productFormId(item)} />
          <span>{(a.price ? t('product.addon', { name: a.name, price: a.price.formatted }) : '') || a.name}</span>
        </label>
      ))}
    </fieldset>
  );
}
