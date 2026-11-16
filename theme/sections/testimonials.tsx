import type { ReactElement } from 'react';
import { Container, Eyebrow, Grid, Heading, Icon, sectionColours } from 'ui-kit';

export const schema = {
  label: 'Testimonials',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'rating_label', type: 'text', label: 'Rating summary' },
    { id: 'anchor', type: 'text', label: 'Anchor id (for links to #id)' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
  blocks: {
    types: ['testimonial'],
    max: 6,
  },
} as const;

type Props = { eyebrow?: string; heading?: string; rating_label?: string; anchor?: string; background_colour?: string; text_colour?: string; accent_colour?: string; blocks: ReactElement[] };

// The merchant's own quotes (testimonial blocks), with their heading and rating summary. No quote, name or rating is made
// up: a new section has no quotes and shows nothing until the merchant adds one. The section never sees its blocks'
// words, so while none of them shows a quote (a testimonial without one renders nothing) ui-kit's uk-if-blocks hides it.
export default function Testimonials({ eyebrow, heading, rating_label, anchor, blocks, ...colours }: Props) {
  if (!blocks.length) return null;
  return (
    <section id={anchor || undefined} className="uk-if-blocks" style={{ padding: 'var(--uk-section-sm) 0', ...sectionColours(colours) }}>
      <Container>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', columnGap: 32, rowGap: 12, marginBottom: 'var(--uk-space-6)' }}>
          <div style={{ maxWidth: 640 }}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {heading ? <Heading>{heading}</Heading> : null}
          </div>
          {rating_label ? (
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
              <span style={{ color: 'var(--uk-color-highlight)' }}><Icon name="star" size={18} /></span>
              {rating_label}
            </p>
          ) : null}
        </div>
        <Grid columns={3}>{blocks}</Grid>
      </Container>
    </section>
  );
}
