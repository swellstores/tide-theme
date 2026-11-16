import { Container, Eyebrow, sectionColours } from 'ui-kit';

export const schema = {
  label: 'Stats',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    {
      id: 'items', type: 'list', label: 'Figures', max: 4,
      item: [
        { id: 'value', type: 'text', label: 'Figure' },
        { id: 'label', type: 'text', label: 'Label' },
      ],
      default: [],
    },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = { eyebrow?: string; items?: { value?: string; label?: string }[]; background_colour?: string; text_colour?: string; accent_colour?: string; };

// The merchant's own figures, each with its label. No figure is made up: a new section has none and shows nothing until
// the merchant writes them.
export default function Stats({ eyebrow, items = [], ...colours }: Props) {
  const shown = items.filter((item) => item && (item.value || item.label));
  if (!shown.length) return null;
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0', ...sectionColours(colours) }}>
      <Container>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 'var(--uk-space-6)', margin: 'var(--uk-space-2) 0 0' }}>
          {shown.map((item, i) => (
            <div key={i} style={{ paddingTop: 22, borderTop: '1px solid var(--uk-color-line-strong)' }}>
              <dt style={{ fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-lg)', fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em', color: 'var(--uk-color-accent)' }}>{item.value}</dt>
              <dd style={{ margin: '12px 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{item.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
