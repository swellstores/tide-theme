import type { ReactElement } from 'react';
import { Container, Eyebrow, Grid, Heading, Section, sectionColours, Text } from 'ui-kit';

export const schema = {
  label: 'Feature list',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'intro', type: 'textarea', label: 'Intro' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['cards', 'row', 'numbered'], default: 'cards' },
    { id: 'columns', type: 'select', label: 'Columns', options: ['3', '2', '4'], default: '3' },
    { id: 'tone', type: 'select', label: 'Background', options: ['sand', 'page'], default: 'sand' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
  blocks: {
    types: ['feature_item'],
    max: 8,
  },
} as const;

type Props = { eyebrow?: string; heading?: string; intro?: string; layout?: string; columns?: string; tone?: string; background_colour?: string; text_colour?: string; accent_colour?: string; blocks: ReactElement[] };

// cards: feature cards in a grid. row: plain items with the icon beside the title, divided by rules.
// numbered: plain items under a large number, without icons. The items read the --feature-* variables set here.
// Nothing until the merchant writes a heading or adds a feature (TD23 review: no instruction copy on the live site).
export default function FeatureList({ eyebrow, heading, intro, layout = 'cards', columns = '3', tone = 'sand', blocks, ...colours }: Props) {
  const cols = columns === '2' ? 2 : columns === '4' ? 4 : 3;
  const head = eyebrow || heading || intro ? (
    <div style={{ maxWidth: 640, marginBottom: 'var(--uk-space-6)' }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? <Heading>{heading}</Heading> : null}
      {intro ? <Text tone="muted">{intro}</Text> : null}
    </div>
  ) : null;
  if (!head && !blocks.length) return null;
  let list: ReactElement;
  if (layout === 'row') {
    list = (
      <ul className={`uk-grid uk-grid--${cols}`} style={{ '--feature-display': 'grid', '--feature-surface': 'transparent', '--feature-padding': '0', '--feature-icon-box': '28px', '--feature-icon-bg': 'transparent', '--feature-icon-gap': '0' }}>
        {blocks.map((b) => <li key={b.key} style={{ paddingTop: 'var(--uk-space-5)', borderTop: '1px solid var(--uk-color-outline)' }}>{b}</li>)}
      </ul>
    );
  } else if (layout === 'numbered') {
    list = (
      <ol className={`uk-grid uk-grid--${cols}`} style={{ '--feature-surface': 'transparent', '--feature-padding': '0', '--feature-icon-display': 'none' }}>
        {blocks.map((b, i) => (
          <li key={b.key} style={{ paddingTop: 'var(--uk-space-5)', borderTop: '2px solid var(--uk-color-ink)' }}>
            <span aria-hidden="true" style={{ display: 'block', marginBottom: 'var(--uk-space-4)', fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-md)', lineHeight: 1, color: 'var(--uk-color-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
            {b}
          </li>
        ))}
      </ol>
    );
  } else {
    list = <Grid columns={cols}>{blocks}</Grid>;
  }
  return (
    <Section tone={tone === 'page' ? 'default' : 'muted'} space={tone === 'page' ? 'sm' : 'md'} style={{ ...sectionColours(colours) }}>
      <Container>
        {head}
        {list}
      </Container>
    </Section>
  );
}
