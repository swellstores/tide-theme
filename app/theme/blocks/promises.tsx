import { Icon } from 'ui-kit';

// The merchant's promises on every product (free returns, a warranty), each with an icon, in one box. Only what the
// merchant writes; nothing without any. Its looks are ui-kit.css's .uk-promises, .uk-promise and .uk-promise-icon, so a
// section's styles can change them.
export const schema = {
  label: 'Promises',
  icon: 'list',
  fields: [
    {
      id: 'points', type: 'list', label: 'Promises', max: 4,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['truck', 'return', 'shield', 'leaf', 'clock', 'check', 'gift', 'heart', 'box'], default: 'check' },
        { id: 'text', type: 'text', label: 'Text' },
      ],
      default: [],
    },
  ],
} as const;

type Props = { points?: { icon?: 'truck' | 'return' | 'shield' | 'leaf' | 'clock' | 'check' | 'gift' | 'heart' | 'box'; text?: string }[] };

export default function Promises({ points }: Props) {
  const list = (points ?? []).filter((pt) => pt.text);
  if (!list.length) return null;
  return (
    <ul className="uk-promises">
      {list.map((pt, i) => (
        <li key={i} className="uk-promise">
          <span className="uk-promise-icon"><Icon name={pt.icon ?? 'check'} size={18} /></span>
          {pt.text}
        </li>
      ))}
    </ul>
  );
}
