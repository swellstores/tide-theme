import type { SectionContext } from 'ui-kit';
import { Button, Heading, Image, sectionColours, Text } from 'ui-kit';

// One slide of a Slideshow (2026-11-27): the merchant's photo filling the slide, and over it their heading, text and up
// to two buttons, or a link for the whole slide (a promotion's banner with its words in the photo: the photo's alt text
// names the link). Over a photo the words are light, under a shade, unless the merchant picks a text color; without a
// photo the slide is the theme's tile (its placeholder art), or the merchant's background color. Only the section's
// first slide loads its photo at once (section.index 0, the page's largest image when the slideshow leads the page);
// the rest are lazy. Its heading is an h2 unless the merchant makes it the page's h1 (a slideshow that leads the page).
export const schema = {
  label: 'Slide',
  fields: [
    { id: 'image', type: 'image', label: 'Image' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'heading_tag', type: 'select', label: 'Heading level (h1: the page\'s main heading, one per page)', options: ['h2', 'h1'], default: 'h2' },
    { id: 'text', type: 'textarea', label: 'Text' },
    { id: 'button_label', type: 'text', label: 'Button label' },
    { id: 'button_link', type: 'url', label: 'Button link' },
    { id: 'button2_label', type: 'text', label: 'Second button label' },
    { id: 'button2_link', type: 'url', label: 'Second button link' },
    { id: 'link', type: 'url', label: 'Link for the whole slide (without buttons; the image\'s alt text names it)' },
    { id: 'align', type: 'select', label: 'Words', options: ['left', 'center', 'right'], default: 'left' },
    { id: 'scrim', type: 'select', label: 'Shade over the image', options: ['medium', 'light', 'strong', 'none'], default: 'medium' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'background_colour', type: 'color', label: 'Background color (without an image)' },
  ],
} as const;

type Props = {
  image?: { url: string; alt?: string; width?: number; height?: number; focal?: { x: number; y: number } } | null;
  heading?: string; heading_tag?: string; text?: string; button_label?: string; button_link?: string; button2_label?: string; button2_link?: string; link?: string;
  align?: string; scrim?: string; text_colour?: string; background_colour?: string; section?: SectionContext;
};

export default function Slide(p: Props) {
  const image = p.image && typeof p.image === 'object' && p.image.url ? p.image : null;
  const first = p.section?.index === 0;
  const align = p.align === 'center' || p.align === 'right' ? p.align : 'left';
  const shade = !image || p.scrim === 'none' ? 0 : p.scrim === 'light' ? 0.22 : p.scrim === 'strong' ? 0.62 : 0.42;
  // over a photo: light words (or the merchant's color), which the buttons follow, as Tide's overlay hero
  const light = p.text_colour || '#ffffff';
  const buttons = !!(p.button_label || p.button2_label);
  const name = p.heading || image?.alt || '';
  const whole = !buttons && !!p.link && !!name;
  const words = p.heading || p.text || buttons;
  const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div style={{ position: 'relative', display: 'grid', alignItems: 'center', overflow: 'hidden', ...sectionColours(image ? { text_colour: light, accent_colour: light } : { background_colour: p.background_colour, text_colour: p.text_colour }) }}>
      <div className="uk-media" style={{ position: 'absolute', inset: 0, borderRadius: 0, background: p.background_colour && !image ? 'none' : undefined }}>
        {image ? <Image image={{ ...image, alt: image.alt ?? '' }} sizes="100vw" priority={first} /> : null}
      </div>
      {shade ? <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0, 0, 0, ${shade * 0.6}) 0%, rgba(0, 0, 0, ${shade}) 100%)` }} /> : null}
      {whole ? <a href={p.link} aria-label={name} style={{ position: 'absolute', inset: 0, zIndex: 2 }} /> : null}
      {words ? (
        <div className="uk-container uk-container--wide" style={{ position: 'relative', zIndex: 1, padding: 'var(--uk-space-8) max(var(--uk-gutter), var(--uk-carousel-inset, 0px))', textAlign: align }}>
          <div style={{ maxWidth: 640, marginLeft: align === 'left' ? undefined : 'auto', marginRight: align === 'right' ? undefined : 'auto' }}>
            {p.heading ? <Heading level={p.heading_tag === 'h1' ? 1 : 2} size="xl">{p.heading}</Heading> : null}
            {p.text ? <div style={{ whiteSpace: 'pre-line' }}><Text size="lg">{p.text}</Text></div> : null}
            {buttons ? (
              <div className="uk-cluster" style={{ marginTop: 'var(--uk-space-5)', justifyContent: justify }}>
                {p.button_label ? <Button href={p.button_link}>{p.button_label}</Button> : null}
                {p.button2_label ? <Button href={p.button2_link} variant="secondary">{p.button2_label}</Button> : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
