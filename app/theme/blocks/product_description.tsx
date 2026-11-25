import type { SectionContext } from 'ui-kit';
import { RichText, sectionProduct } from 'ui-kit';

// A product section's block: the product's description from the store. Nothing without one.
export const schema = { label: 'Description', icon: 'text', fields: [] } as const;

type Props = { section?: SectionContext };

export default function ProductDescription({ section }: Props) {
  const item = sectionProduct(section);
  if (!item?.description.length) return null;
  return <div style={{ fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}><RichText value={item.description} /></div>;
}
