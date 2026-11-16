import { safeUrl } from 'ui-kit';

// Retired: the footer shows the store's footer menu as its columns. Columns stored before that still render, after the
// menu's, until the theme update moves them into the menu.
export const schema = {
  label: 'Link column',
  retired: true,
  fields: [
    { id: 'heading', type: 'text', label: 'Heading' },
    {
      id: 'links', type: 'list', label: 'Links', max: 8,
      item: [
        { id: 'label', type: 'text', label: 'Label' },
        { id: 'href', type: 'url', label: 'Link' },
      ],
    },
  ],
} as const;

type Props = { heading?: string; links?: { label?: string; href?: string }[] };

export default function LinkColumn({ heading, links = [] }: Props) {
  const shown = links.map((link) => ({ label: link.label, href: safeUrl(link.href) }));
  return (
    <div>
      {heading ? (
        <h2 style={{ margin: '0 0 var(--uk-space-4)', fontSize: 'var(--uk-text-xs)', fontWeight: 700, lineHeight: 1.4, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--uk-color-text-subtle)' }}>{heading}</h2>
      ) : null}
      <ul style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
        {shown.map((link, i) => (
          <li key={i}>
            <a href={link.href} style={{ fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
