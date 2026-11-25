import type { SectionContext } from 'ui-kit';
import { sectionProduct } from 'ui-kit';

// A product section's block: the product's attributes from the store (material, size, care), each with its values.
// Nothing without any.
export const schema = { label: 'Specifications', icon: 'list', fields: [] } as const;

type Props = { section?: SectionContext };

export default function ProductSpecs({ section }: Props) {
  const item = sectionProduct(section);
  const attributes = item ? item.attributes.filter((a) => a.values.length) : [];
  if (!attributes.length) return null;
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--uk-space-4)', margin: 0, padding: 'var(--uk-space-4) 0', borderTop: '1px solid var(--uk-color-line)', borderBottom: '1px solid var(--uk-color-line)' }}>
      {attributes.map((a) => (
        <div key={a.id}>
          <dt style={{ fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-muted)' }}>{a.name}</dt>
          <dd style={{ margin: 'var(--uk-space-1) 0 0', fontSize: 'var(--uk-text-md)', fontWeight: 600, color: 'var(--uk-color-heading)' }}>{a.values.join(', ')}</dd>
        </div>
      ))}
    </dl>
  );
}
