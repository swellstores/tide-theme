import { RichText } from 'ui-kit';

// The merchant's own words in a section that takes blocks: on the product page, under the buy box (a size note, a
// delivery cut-off, a demo store's notice). Rich text (bold, italic, links, lists, small headings and tables); text
// saved before it was rich reads as before, its line breaks kept. Empty: nothing.
export const schema = {
  label: 'Text',
  fields: [
    { id: 'text', type: 'richtext', label: 'Text' },
  ],
} as const;

type Props = { text?: string };

export default function Text({ text }: Props) {
  if (typeof text !== 'string' || !text.trim()) return null;
  return <div style={{ fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}><RichText value={text} /></div>;
}
