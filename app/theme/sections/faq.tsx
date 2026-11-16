import { Container, Eyebrow, Heading, Icon, sectionColours, Text } from 'ui-kit';

export const schema = {
  label: 'FAQ',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Common questions' },
    { id: 'intro', type: 'textarea', label: 'Intro' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link' },
    {
      id: 'items', type: 'list', label: 'Questions', max: 12,
      item: [
        { id: 'question', type: 'text', label: 'Question' },
        { id: 'answer', type: 'textarea', label: 'Answer' },
      ],
      default: [],
    },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = { eyebrow?: string; heading?: string; intro?: string; link_label?: string; link_href?: string; items?: { question?: string; answer?: string }[]; background_colour?: string; text_colour?: string; accent_colour?: string; };

// The merchant's own questions and answers. None is made up: a new section has none and shows nothing until the merchant
// writes one.
export default function Faq({ eyebrow, heading, intro, link_label, link_href, items = [], ...colours }: Props) {
  const shown = items.filter((item) => item && (item.question || item.answer));
  if (!shown.length) return null;
  return (
    <section style={{ padding: 'var(--uk-section-md) 0', background: 'var(--uk-color-muted-bg)', ...sectionColours(colours) }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)', gap: 'var(--uk-space-8)', alignItems: 'start' }}>
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {heading ? <Heading>{heading}</Heading> : null}
            {intro ? <Text tone="muted">{intro}</Text> : null}
            {link_label ? (
              <p style={{ margin: 'var(--uk-space-5) 0 0' }}>
                <a className="uk-link" href={link_href}>{link_label}</a>
              </p>
            ) : null}
          </div>
          <div style={{ borderTop: '1px solid var(--uk-color-line-strong)' }}>
            {shown.map((item, i) => (
              <details key={i} className="uk-disclosure" open={i === 0} style={{ borderColor: 'var(--uk-color-line-strong)' }}>
                <summary style={{ padding: '20px 0', fontSize: 'var(--uk-text-md)' }}>
                  {item.question}
                  <Icon name="chevron" size={20} />
                </summary>
                <p style={{ maxWidth: 620, margin: '0 0 22px', fontSize: 'var(--uk-text-md)' }}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
