import type { Translate } from 'ui-kit';
import { Card, Eyebrow, Image, ProductForm } from 'ui-kit';

export const schema = {
  label: 'Featured product upsell',
  icon: 'package',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Small heading', default: 'You might also like' },
    { id: 'product', type: 'product', label: 'Product' },
    { id: 'add_label', type: 'text', label: 'Add button', retired: true },
    { id: 'sold_out_label', type: 'text', label: 'Sold out text', retired: true },
  ],
} as const;

export default function UpsellProduct({ t, eyebrow, product }: { t: Translate; eyebrow?: string; product?: any }) {
  const p = product && typeof product === 'object' ? product : null;
  if (!p) return null;
  const img = Array.isArray(p.images) && p.images[0] ? p.images[0] : null;
  return (
    <Card tone="outline">
      <div style={{ display: 'grid', gap: 'var(--uk-space-3)', padding: 'var(--uk-space-4)' }}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <div style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: 'var(--uk-space-3)', alignItems: 'center' }}>
          <a href={p.url} className="uk-media" style={{ display: 'block', width: 72, height: 72, overflow: 'hidden' }}>
            {img ? <Image image={img} alt={p.name} width={72} height={72} sizes="72px" /> : null}
          </a>
          <a href={p.url} className="uk-link" style={{ fontWeight: 600, color: 'var(--uk-color-heading)' }}>{p.name}</a>
        </div>
        <ProductForm product={p} labels={{ add: t('product.add_to_cart') || 'Add', sold_out: t('product.sold_out') || 'Sold out' }} />
      </div>
    </Card>
  );
}
