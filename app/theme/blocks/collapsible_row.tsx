import type { SiteInfo, Translate } from 'ui-kit';
import { Icon, RichText } from 'ui-kit';

// A row that opens to show more (details, care, a size guide), closed at first unless set to open. Its text is rich
// text (bold, italic, links, lists, small headings and tables); text saved before it was rich reads as before: a blank
// line starts a new paragraph, and two or more lines with | between their cells make a table (the first line its
// heading). With "Store policies" shown, it lists links to the store's refund policy and terms, as the store has them
// (never words of its own about shipping or returns). Nothing without a title.
export const schema = {
  label: 'Collapsible row',
  icon: 'list',
  fields: [
    { id: 'title', type: 'text', label: 'Title' },
    { id: 'text', type: 'richtext', label: 'Text' },
    { id: 'policies', type: 'select', label: 'Store policies (links to the refund policy and terms)', options: ['hide', 'show'], default: 'hide' },
    { id: 'open', type: 'select', label: 'At first', options: ['closed', 'open'], default: 'closed' },
  ],
  presets: [
    { label: 'Shipping & returns', props: { policies: 'show' }, text: { title: 'product.shipping_returns' } },
    { label: 'Size guide', text: { title: 'product.size_guide', text: 'product.size_guide_table' } },
  ],
} as const;

type Props = { t: Translate; site?: SiteInfo; title?: string; text?: string; policies?: string; open?: string };

export default function CollapsibleRow({ t, site, title, text, policies, open }: Props) {
  const name = typeof title === 'string' ? title.trim() : '';
  if (!name) return null;
  const links = policies === 'show' ? (site?.store.policies ?? []).filter((p) => p.id === 'refund' || p.id === 'terms') : [];
  return (
    <details className="uk-disclosure" open={open === 'open'}>
      <summary>
        {name}
        <Icon name="chevron" size={18} />
      </summary>
      {typeof text === 'string' && text.trim() ? <RichText value={text} /> : null}
      {links.length ? (
        <div>
          {t('product.policies_intro') ? <p style={{ margin: '0 0 var(--uk-space-2)' }}>{t('product.policies_intro')}</p> : null}
          <ul style={{ display: 'grid', gap: 'var(--uk-space-1)', margin: 0, padding: 0, listStyle: 'none' }}>
            {links.map((p) => <li key={p.id}><a href={p.url} className="uk-link">{p.title}</a></li>)}
          </ul>
        </div>
      ) : null}
    </details>
  );
}
