import type { SectionContext } from 'ui-kit';
import { sectionProduct } from 'ui-kit';

// A product section's block: the product's attributes from the store (material, size, care), each with its values.
// Nothing without any. Its looks are ui-kit.css's .uk-specs, .uk-spec-name and .uk-spec-value, so a section's styles can
// change them.
export const schema = { label: 'Specifications', icon: 'list', fields: [] } as const;

type Props = { section?: SectionContext };

export default function ProductSpecs({ section }: Props) {
  const item = sectionProduct(section);
  const attributes = item ? item.attributes.filter((a) => a.values.length) : [];
  if (!attributes.length) return null;
  return (
    <dl className="uk-specs">
      {attributes.map((a) => (
        <div key={a.id}>
          <dt className="uk-spec-name">{a.name}</dt>
          <dd className="uk-spec-value">{a.values.join(', ')}</dd>
        </div>
      ))}
    </dl>
  );
}
