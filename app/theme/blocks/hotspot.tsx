import type { ProductData, SiteInfo, Translate } from 'ui-kit';
import { Hotspot, pricesHiddenFor } from 'ui-kit';

// A product pin on a shoppable photo (theme-lineup "Shared needs"): any theme's section that shows a photo with ui-kit
// ShoppableImage accepts these blocks inside it. Where it sits (x, y: percent of the photo's width and height, in 5%
// steps) and which product it shows; the pin opens a small card with the product's photo, name, price and quick add.
const STEPS = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95'];
export const schema = {
  label: 'Product pin',
  fields: [
    { id: 'product', type: 'product', label: 'Product' },
    { id: 'x', type: 'select', label: 'Across the photo (%)', options: STEPS, default: '50' },
    { id: 'y', type: 'select', label: 'Down the photo (%)', options: STEPS, default: '50' },
  ],
} as const;

export default function HotspotBlock({ t, product, x, y, site }: { t: Translate; product?: ProductData | null; x?: string; y?: string; site?: SiteInfo }) {
  return (
    <Hotspot
      product={product && typeof product === 'object' ? product : null} x={x} y={y} pricesHidden={pricesHiddenFor(site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: site?.theme_settings?.apply_page })}
      labels={{ show: (name: string) => t('product.pin', { name }), add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }}
    />
  );
}
