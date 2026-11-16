import type { IconName } from 'ui-kit';
import { Heading, Icon } from 'ui-kit';

export const schema = {
  label: 'Feature',
  fields: [
    { id: 'icon', type: 'select', label: 'Icon', options: ['shield', 'return', 'truck', 'leaf', 'sparkle', 'heart', 'gift', 'box', 'globe', 'clock', 'check', 'chat', 'star', 'pin', 'mountain', 'droplet', 'compass', 'weight', 'ruler', 'backpack'], default: 'shield' },
    { id: 'title', type: 'text', label: 'Title' },
    { id: 'text', type: 'textarea', label: 'Text' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'href', type: 'url', label: 'Link' },
  ],
} as const;

type Props = { icon?: IconName; title?: string; text?: string; link_label?: string; href?: string };

// A card by default. The feature list around it can restyle it with CSS variables: --feature-display (grid puts the
// icon beside the title), --feature-surface, --feature-padding, --feature-icon-display, --feature-icon-box (its size),
// --feature-icon-bg and --feature-icon-gap (the space under it). Nothing until the merchant writes its title or text.
export default function FeatureItem({ icon = 'shield', title, text, link_label, href }: Props) {
  if (!title && !text) return null;
  return (
    <div className="uk-card" style={{ display: 'var(--feature-display, block)', gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: 'var(--uk-space-3)', alignItems: 'center', height: '100%', padding: 'var(--feature-padding, var(--uk-space-6))', background: 'var(--feature-surface, var(--uk-color-surface))' }}>
      <span style={{ display: 'var(--feature-icon-display, inline-grid)', placeItems: 'center', width: 'var(--feature-icon-box, 48px)', height: 'var(--feature-icon-box, 48px)', marginBottom: 'var(--feature-icon-gap, 20px)', borderRadius: 'var(--uk-radius-pill)', background: 'var(--feature-icon-bg, var(--uk-color-accent-soft))', color: 'var(--uk-color-accent)' }}>
        <Icon name={icon} size={24} />
      </span>
      <Heading level={3}>{title}</Heading>
      {text ? <p style={{ gridColumn: '1 / -1', margin: 0, color: 'var(--uk-color-text-muted)' }}>{text}</p> : null}
      {link_label && href ? (
        <p style={{ gridColumn: '1 / -1', margin: '16px 0 0' }}>
          <a className="uk-link" href={href}>{link_label}</a>
        </p>
      ) : null}
    </div>
  );
}
