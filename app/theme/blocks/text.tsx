// The merchant's own words in a section that takes blocks: on the product page, under the buy box (a size note, a
// delivery cut-off, a demo store's notice). Plain text with its line breaks kept; empty: nothing.
export const schema = {
  label: 'Text',
  fields: [
    { id: 'text', type: 'textarea', label: 'Text' },
  ],
} as const;

type Props = { text?: string };

export default function Text({ text }: Props) {
  const value = typeof text === 'string' ? text.trim() : '';
  if (!value) return null;
  return <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{value}</p>;
}
