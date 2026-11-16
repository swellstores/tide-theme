import { Icon } from 'ui-kit';

export const schema = {
  label: 'Testimonial',
  fields: [
    { id: 'quote', type: 'textarea', label: 'Quote' },
    { id: 'author', type: 'text', label: 'Name' },
    { id: 'detail', type: 'text', label: 'Detail' },
    { id: 'rating', type: 'select', label: 'Stars', options: ['none', '5', '4', '3'], default: 'none' },
  ],
} as const;

type Props = { quote?: string; author?: string; detail?: string; rating?: string };

// A quote the merchant adds, with its stars only when the merchant chose some. Nothing without a quote.
export default function Testimonial({ quote, author, detail, rating }: Props) {
  if (!quote) return null;
  const stars = Math.max(0, Math.min(5, parseInt(rating ?? '', 10) || 0));
  return (
    <figure className="uk-card" style={{ display: 'flex', flexDirection: 'column', gap: 18, height: '100%', margin: 0 }}>
      {stars ? (
        <div style={{ display: 'flex', gap: 3, color: 'var(--uk-color-highlight)' }}>
          {Array.from({ length: stars }, (_, i) => <Icon key={i} name="star" size={17} />)}
        </div>
      ) : null}
      <blockquote style={{ margin: 0, fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-text-lg)', lineHeight: 1.45, color: 'var(--uk-color-heading)' }}>
        “{quote}”
      </blockquote>
      {author || detail ? (
        <figcaption style={{ marginTop: 'auto', fontSize: 'var(--uk-text-sm)', lineHeight: 1.5 }}>
          {author ? <strong style={{ display: 'block', color: 'var(--uk-color-ink)' }}>{author}</strong> : null}
          {detail ? <span style={{ color: 'var(--uk-color-text-subtle)' }}>{detail}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
