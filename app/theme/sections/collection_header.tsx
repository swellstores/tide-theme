import type { CollectionData, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Heading, Image } from 'ui-kit';

export const schema = {
  label: 'Collection header',
  fields: [
    { id: 'collection', type: 'collection', label: 'Collection', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (when there is no collection)' },
    { id: 'description', type: 'textarea', label: 'Description (when there is no collection)' },
    { id: 'home_label', type: 'text', label: 'Breadcrumb: home link', retired: true },
    { id: 'breadcrumb_label', type: 'text', label: 'Breadcrumb name (for screen readers)', retired: true },
    { id: 'show_children', type: 'select', label: 'Subcategories', options: ['show', 'hide'], default: 'show' },
    { id: 'children_label', type: 'text', label: 'Subcategories name (for screen readers)', retired: true },
  ],
} as const;

type Props = {
  t: Translate;
  collection?: CollectionData | null; heading?: string; description?: string; show_children?: string;
  };

// A store collection's trail (Home › its parent category › it), name, description (as plain text), image and links to
// its subcategories: on a collection page the page's own collection by default. Without a collection it shows the
// heading and description set here, and nothing when they are empty.
export default function CollectionHeader({ t, collection, heading, description, show_children }: Props) {
  const c = collection && typeof collection === 'object' ? collection : null;
  const title = c ? c.name : heading;
  const text = c ? (Array.isArray(c.description) ? c.description.map((b) => b.text).filter(Boolean) : []) : description ? [description] : [];
  const image = c?.image ?? null;
  const children = c && show_children !== 'hide' && Array.isArray(c.children) ? c.children : [];
  if (!title && !text.length && !image) return null;
  const copy = (
    <div>
      {c ? (
        <div style={{ marginBottom: 'var(--uk-space-3)' }}>
          <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, c.parent, { name: c.name, url: c.url }]} label={t('navigation.breadcrumb')} />
        </div>
      ) : null}
      {title ? <Heading level={1} size="xl">{title}</Heading> : null}
      {text.map((t, i) => (
        <p key={i} style={{ margin: 'var(--uk-space-3) 0 0', maxWidth: '60ch', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t}</p>
      ))}
      {children.length ? (
        <nav aria-label={t('collection.subcategories') || undefined} style={{ marginTop: 'var(--uk-space-5)' }}>
          <ul className="uk-cluster" style={{ gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
            {children.map((k) => <li key={k.slug}><a className="uk-chip" href={k.url}>{k.name}</a></li>)}
          </ul>
        </nav>
      ) : null}
    </div>
  );
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-space-5)' }}>
      <Container>
        {image ? (
          <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'center' }}>
            {copy}
            <div className="uk-media" style={{ aspectRatio: '4 / 3', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
              <Image image={image} sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(47.5vw - 48px), 520px" priority />
            </div>
          </div>
        ) : copy}
      </Container>
    </section>
  );
}
