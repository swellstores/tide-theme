import type { ReactElement } from 'react';
import type { Translate } from 'ui-kit';
import { Carousel, carouselLabels, Container, sectionColours } from 'ui-kit';

// A slideshow of the merchant's slides (slide blocks: a photo with a heading, text and buttons each), one at a time on
// ui-kit's Carousel (2026-11-27): every slide is in the page and swipes and scrolls without any script; the platform
// script adds the arrows, the dots and, when the merchant turns it on, slides that change by themselves (never under
// reduced motion, with a pause button, held while a shopper points at or tabs into it, stopped for good once they use
// an arrow or a dot). Each slide is the same height (Height), so nothing shifts as photos load; only the first slide's
// photo loads at once. Full width, or the page's width with rounded slides. A new section starts with three slides
// whose words are neutral: the merchant adds their photos and words.
export const schema = {
  label: 'Slideshow',
  fields: [
    { id: 'autoplay', type: 'select', label: 'Change slides by themselves, every (seconds; shoppers can pause)', options: ['off', '4', '5', '6', '8', '10'], default: 'off' },
    { id: 'loop', type: 'select', label: 'Arrows go round from the last slide to the first', options: ['yes', 'no'], default: 'yes' },
    { id: 'height', type: 'select', label: 'Height (banner: a wide 16:5 strip, for photos with their own words)', options: ['medium', 'short', 'tall', 'screen', 'banner'], default: 'medium' },
    { id: 'width', type: 'select', label: 'Width', options: ['full', 'page'], default: 'full' },
    { id: 'peek', type: 'select', label: 'Show the edge of the next slide', options: ['off', 'on'], default: 'off' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
  ],
  blocks: {
    types: ['slide'],
    max: 12,
    default: [
      { type: 'slide', props: { heading: 'Discover our latest products', heading_tag: 'h1', button_label: 'Shop all', button_link: '/products' } },
      { type: 'slide', props: { heading: 'Shop by category', button_label: 'Browse categories', button_link: '/categories' } },
      { type: 'slide', props: { heading: 'Find what you need', button_label: 'Search the store', button_link: '/search' } },
    ],
  },
} as const;

// The arrows and the pause button keep off the page's edge when the slides fill the width; the page-width slides are
// rounded as the theme's images are.
export const styles = `
& .slideshow--full .uk-carousel-dots { padding: 0 var(--uk-space-2); }
& .slideshow--full .uk-carousel-play { margin-right: var(--uk-space-3); }
& .slideshow--page .uk-carousel-slide { overflow: hidden; border-radius: var(--uk-radius-image, var(--uk-radius-lg)); }
`;

const HEIGHTS: Record<string, string> = {
  short: 'clamp(320px, 46vh, 460px)', medium: 'clamp(420px, 62vh, 640px)', tall: 'clamp(520px, 80vh, 860px)', screen: '100vh', banner: '200px',
};

type Props = { t: Translate; autoplay?: string; loop?: string; height?: string; width?: string; peek?: string; background_colour?: string; blocks: ReactElement[] };

export default function Slideshow({ t, autoplay, loop, height = 'medium', width, peek, background_colour, blocks }: Props) {
  if (!blocks.length) return null;
  const page = width === 'page';
  const carousel = (
    <Carousel labels={carouselLabels(t)} loop={loop !== 'no'} peek={peek === 'on'} autoplay={Number(autoplay) || undefined} ratio={height === 'banner' ? '16 / 5' : undefined}>
      {blocks}
    </Carousel>
  );
  return (
    <section className={page ? 'slideshow--page' : 'slideshow--full'} style={{ padding: page ? 'var(--uk-section-sm) 0' : '0 0 var(--uk-space-2)', '--uk-carousel-height': HEIGHTS[height] ?? HEIGHTS.medium, ...sectionColours({ background_colour }) }}>
      {page ? <Container>{carousel}</Container> : carousel}
    </section>
  );
}
