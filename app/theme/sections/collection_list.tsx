import type { ReactElement, ReactNode } from 'react';
import type { CollectionData, SiteInfo, Translate } from 'ui-kit';
import { Container, Eyebrow, Grid, Heading, Icon, Image, sectionColours } from 'ui-kit';

// The store's categories (Store collections): the top-level ones, or ones picked by hand. Collection cards typed in by
// hand before (a retired block type) still show after them.
export const schema = {
  label: 'Collection list',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Shop by category' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/categories' },
    { id: 'collections', type: 'collection_list', label: 'Store collections', max: 24, default: { from: 'top', limit: 3 } },
    { id: 'page_list', type: 'select', label: 'The categories page\'s own list (its heading is the page\'s)', options: ['no', 'yes'], default: 'no' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
    { id: 'empty_label', type: 'text', label: 'The page\'s own list with no categories', retired: true },
    { id: 'source', type: 'select', label: 'Show', options: ['cards', 'store'], retired: true },
  ],
  // Collection cards typed in before the list showed the store's categories: still shown after them.
  blocks: {
    types: ['collection_card'],
    max: 6,
  },
} as const;

type Props = {
  t: Translate;
  eyebrow?: string; heading?: string; link_label?: string; link_href?: string; collections?: CollectionData[] | null; page_list?: string; background_colour?: string; text_colour?: string; accent_colour?: string;   site?: SiteInfo; blocks: ReactElement[];
};

// A card's title: an h2 or an h3 (TD22 review m3: the next level under the section's heading).
function Title({ level, children }: { level: 2 | 3; children?: ReactNode }) {
  return level === 2 ? <h2 style={{ margin: 0, fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-sm)', fontWeight: 600, color: 'var(--uk-color-heading)' }}>{children}</h2> : <h3 style={{ margin: 0, fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-sm)', fontWeight: 600, color: 'var(--uk-color-heading)' }}>{children}</h3>;
}

// A store collection as a card: its image (decorative: the name says it; a plain tile without one), name (an h2 under no
// heading or the page's, else an h3) and the start of its description's first paragraph.
function StoreCard({ collection: c, level }: { collection: CollectionData; level: 2 | 3 }) {
  const text = (Array.isArray(c.description) ? c.description.find((b) => b.kind === 'p')?.text : '');
  return (
    <a href={c.url} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <div className="uk-media" style={{ aspectRatio: '4 / 3', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
        {c.image ? (
          <Image image={c.image} alt="" sizes="(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 40px), (max-width: 1200px) calc(33.33vw - 53px), 347px" />
        ) : (
          <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={56} /></span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 18 }}>
        <Title level={level}>{c.name}</Title>
        <span style={{ display: 'inline-grid', placeItems: 'center', flex: 'none', width: 36, height: 36, borderRadius: 'var(--uk-radius-pill)', boxShadow: 'inset 0 0 0 1px var(--uk-color-outline)', color: 'var(--uk-color-accent)' }}>
          <Icon name="arrow" size={18} />
        </span>
      </div>
      {text ? <p style={{ margin: '6px 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{text.length > 120 ? `${text.slice(0, 119).trimEnd()}…` : text}</p> : null}
    </a>
  );
}

// The store's collections, then any card blocks; nothing with neither. The list marked as the categories page's own
// (page_list; only that one, so a page has one h1) has the page's heading (h1; without a heading, a visually hidden one
// with the page's title), and with no categories says so under it (the live page is then noindex).
export default function CollectionList({ t, eyebrow, heading, link_label, link_href, collections, page_list, site, blocks, ...colours }: Props) {
  const items = Array.isArray(collections) ? collections : [];
  const own = page_list === 'yes' && site?.page.kind === 'categories';
  if (!items.length && !blocks.length && !(own && t('collection.no_categories'))) return null;
  return (
    <section style={{ padding: own ? 'var(--uk-space-7) 0 var(--uk-section-sm)' : 'var(--uk-section-sm) 0', ...sectionColours(colours) }}>
      <Container>
        {own && !heading && site?.page.title ? <h1 className="uk-visually-hidden">{site.page.title}</h1> : null}
        {eyebrow || heading || link_label ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', columnGap: 24, rowGap: 12, marginBottom: 'var(--uk-space-6)' }}>
            <div>
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              {heading ? <Heading level={own ? 1 : 2} size={own ? 'xl' : undefined}>{heading}</Heading> : null}
            </div>
            {link_label ? <a className="uk-link" href={link_href}>{link_label}</a> : null}
          </div>
        ) : null}
        {items.length || blocks.length ? (
          <Grid columns={3} gap="lg">{items.map((c) => <StoreCard key={c.id} collection={c} level={heading && !own ? 3 : 2} />)}{blocks}</Grid>
        ) : <p style={{ margin: 0, fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('collection.no_categories')}</p>}
      </Container>
    </section>
  );
}
