import type { PostData, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Container, DateText, Heading, Image, RichText } from 'ui-kit';

// A blog post from the store (Content › Blogs in the dashboard): the trail (Home › its blog › it), its title, date,
// author, image, text and tags, all from the post. On the post's own address it is the page's own (the page's heading,
// h1); another post shown here has an h2. The image keeps its alt text only when it is not the post's title again.
export const schema = {
  label: 'Post',
  fields: [
    { id: 'post', type: 'blog_post', label: 'Post', default: 'current' },
    { id: 'home_label', type: 'text', label: 'Breadcrumb: home link', retired: true },
    { id: 'breadcrumb_label', type: 'text', label: 'Breadcrumb name (for screen readers)', retired: true },
    { id: 'by_label', type: 'text', label: 'Author ({author} is filled in)', retired: true },
    { id: 'tags_label', type: 'text', label: 'Tags name (for screen readers)', retired: true },
  ],
} as const;

type Props = { t: Translate; post?: PostData | null; site?: SiteInfo };

// Nothing without a post.
export default function PostBody({ t, post, site }: Props) {
  const item = post && typeof post === 'object' ? post : null;
  if (!item) return null;
  const own = site?.page.kind === 'post' && item.url === site.page.path;
  const blog = item.blog ? { name: item.blog.title, url: item.blog.url } : null;
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  return (
    <article style={{ padding: 'var(--uk-space-7) 0 var(--uk-section-sm)' }}>
      <Container width="narrow">
        <div style={{ marginBottom: 'var(--uk-space-4)' }}>
          <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, blog, { name: item.title, url: item.url }]} label={t('navigation.breadcrumb')} />
        </div>
        <Heading level={own ? 1 : 2} size="xl">{item.title}</Heading>
        {item.published_at || (item.author && t('blog.by')) ? (
          <p style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', margin: 'var(--uk-space-3) 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
            {item.published_at ? <DateText iso={item.published_at} locale={site?.locale} /> : null}
            {item.author && t('blog.by') ? <span>{t('blog.by', { author: item.author! })}</span> : null}
          </p>
        ) : null}
      </Container>
      {item.image ? (
        <Container>
          <div className="uk-media" style={{ aspectRatio: '16 / 9', margin: 'var(--uk-space-6) 0 0', borderRadius: 'var(--uk-radius-image, var(--uk-radius-lg))' }}>
            <Image image={item.image} alt={item.image.alt === item.title ? '' : item.image.alt} sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1200px) calc(100vw - 96px), 1104px" priority={own} />
          </div>
        </Container>
      ) : null}
      <Container width="narrow">
        {item.content?.length ? (
          <div style={{ marginTop: 'var(--uk-space-6)', fontSize: 'var(--uk-text-md)', lineHeight: 1.65 }}>
            <RichText value={item.content} />
          </div>
        ) : null}
        {tags.length ? (
          <ul aria-label={t('blog.tags') || undefined} className="uk-cluster" style={{ gap: 8, margin: 'var(--uk-space-6) 0 0', padding: 0, listStyle: 'none' }}>
            {tags.map((t, i) => <li key={i} className="uk-chip">{t}</li>)}
          </ul>
        ) : null}
      </Container>
    </article>
  );
}
