import type { SiteInfo, Translate } from 'ui-kit';
import { Icon } from 'ui-kit';

// A row that opens to show more (details, care, a size guide), closed at first unless set to open. Its text keeps its
// line breaks; a blank line starts a new paragraph, and lines with | between their cells make a table (the first line
// its heading). With "Store policies" shown, it lists links to the store's refund policy and terms, as the store has
// them (never words of its own about shipping or returns). Nothing without a title.
export const schema = {
  label: 'Collapsible row',
  icon: 'list',
  fields: [
    { id: 'title', type: 'text', label: 'Title' },
    { id: 'text', type: 'textarea', label: 'Text (lines with | between cells make a table)' },
    { id: 'policies', type: 'select', label: 'Store policies (links to the refund policy and terms)', options: ['hide', 'show'], default: 'hide' },
    { id: 'open', type: 'select', label: 'At first', options: ['closed', 'open'], default: 'closed' },
  ],
  presets: [
    { label: 'Shipping & returns', props: { policies: 'show' }, text: { title: 'product.shipping_returns' } },
    { label: 'Size guide', text: { title: 'product.size_guide', text: 'product.size_guide_table' } },
  ],
} as const;

type Props = { t: Translate; site?: SiteInfo; title?: string; text?: string; policies?: string; open?: string };

const cells = (line: string) => line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());

// The text's parts: paragraphs (line breaks kept) and tables (consecutive lines with a |).
function parts(text: string) {
  const out: ({ kind: 'p'; text: string } | { kind: 'table'; rows: string[][] })[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    const lines = chunk.split('\n').filter((l) => l.trim());
    let para: string[] = [];
    let rows: string[][] = [];
    const flush = () => {
      if (para.length) out.push({ kind: 'p', text: para.join('\n') });
      if (rows.length) out.push({ kind: 'table', rows });
      para = [];
      rows = [];
    };
    for (const l of lines) {
      if (l.includes('|')) {
        if (para.length) flush();
        rows.push(cells(l));
      } else {
        if (rows.length) flush();
        para.push(l.trim());
      }
    }
    flush();
  }
  return out;
}

export default function CollapsibleRow({ t, site, title, text, policies, open }: Props) {
  const name = typeof title === 'string' ? title.trim() : '';
  if (!name) return null;
  const body = typeof text === 'string' ? parts(text.trim()) : [];
  const links = policies === 'show' ? (site?.store.policies ?? []).filter((p) => p.id === 'refund' || p.id === 'terms') : [];
  return (
    <details className="uk-disclosure" open={open === 'open'}>
      <summary>
        {name}
        <Icon name="chevron" size={18} />
      </summary>
      {body.map((b, i) => (b.kind === 'p' ? <p key={i} style={{ whiteSpace: 'pre-line' }}>{b.text}</p> : (
        <div key={i} style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--uk-text-sm)' }}>
            <thead>
              <tr>{b.rows[0].map((c, j) => <th key={j} style={{ textAlign: 'start', padding: 'var(--uk-space-2)', borderBottom: '1px solid var(--uk-color-line-strong)', color: 'var(--uk-color-heading)' }}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.slice(1).map((r, k) => (
                <tr key={k}>{b.rows[0].map((_, j) => <td key={j} style={{ padding: 'var(--uk-space-2)', borderBottom: '1px solid var(--uk-color-line)' }}>{r[j] ?? ''}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )))}
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
