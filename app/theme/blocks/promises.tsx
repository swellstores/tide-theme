import { Icon } from 'ui-kit';

// The merchant's promises on every product (free returns, a warranty), each with an icon, in one box. Only what the
// merchant writes; nothing without any.
export const schema = {
  label: 'Promises',
  icon: 'list',
  fields: [
    {
      id: 'points', type: 'list', label: 'Promises', max: 4,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['truck', 'return', 'shield', 'leaf', 'clock', 'check'], default: 'check' },
        { id: 'text', type: 'text', label: 'Text' },
      ],
      default: [],
    },
  ],
} as const;

type Props = { points?: { icon?: 'truck' | 'return' | 'shield' | 'leaf' | 'clock' | 'check'; text?: string }[] };

export default function Promises({ points }: Props) {
  const list = (points ?? []).filter((pt) => pt.text);
  if (!list.length) return null;
  return (
    <ul style={{ display: 'grid', gap: 'var(--uk-space-3)', margin: 0, padding: 'var(--uk-space-4)', background: 'var(--uk-color-muted-bg)', borderRadius: 'var(--uk-radius-md)', listStyle: 'none', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
      {list.map((pt, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 'none', display: 'inline-grid', color: 'var(--uk-color-accent)' }}><Icon name={pt.icon ?? 'check'} size={18} /></span>
          {pt.text}
        </li>
      ))}
    </ul>
  );
}
