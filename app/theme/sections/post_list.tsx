import { useId } from 'react';
import type { ReactNode } from 'react';
import type { PostData, PostList as Posts, SiteInfo, Translate } from 'ui-kit';
import { Container, DateText, Heading, Image, Pagination } from 'ui-kit';

// The store's blog posts (Content › Blogs in the dashboard), newest first: on a blog page the blog's own posts, a page
// at a time with links to the other pages (they open at the list: its id, from useId, which the platform prefixes with
// the section's id); on a post page the post's blog's other posts. Each card: the post's image, date, title, summary and
// author, all from the post.
export const schema = {
  label: 'Post list',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'posts', type: 'blog_posts', label: 'Posts', max: 24, default: { from: 'blog', blog: 'current', limit: 12 } },
    { id: 'columns', type: 'select', label: 'Columns', options: ['3', '2'], default: '3' },
    { id: 'by_label', type: 'text', label: 'Author ({author} is filled in)', retired: true },
    { id: 'empty_label', type: 'text', label: 'The blog page\'s own list with no posts', retired: true },
    { id: 'pagination_label', type: 'text', label: 'Pages (for screen readers)', retired: true },
    { id: 'prev_label', type: 'text', label: 'Previous page link', retired: true },
    { id: 'next_label', type: 'text', label: 'Next page link', retired: true },
    { id: 'page_label', type: 'text', label: 'Page (for screen readers)', retired: true },
    { id: 'of_label', type: 'text', label: 'Of (for screen readers)', retired: true },
  ],
} as const;

type Props = {
  t: Translate;
  heading?: string; posts?: Posts | null; columns?: string;   site?: SiteInfo;
};

// A card's title: an h2 or an h3, the next level under the section's heading.
function Title({ level, children }: { level: 2 | 3; children?: ReactNode }) {
  return level === 2
    ? <h2 style={{ margin: 'var(--uk-space-3) 0 0', fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-sm)', fontWeight: 600, lineHeight: 1.25, color: 'var(--uk-color-heading)' }}>{children}</h2>
    : <h3 style={{ margin: 'var(--uk-space-3) 0 0', fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-sm)', fontWeight: 600, lineHeight: 1.25, color: 'var(--uk-color-heading)' }}>{children}</h3>;
}

// The image is decorative (alt=""): the title beside it names the post.
function Card({ post, level, by, locale, sizes }: { post: PostData; level: 2 | 3; by?: string; locale?: string; sizes: string }) {
  return (
    <article style={{ display: 'grid', alignContent: 'start' }}>
      {post.image ? (
        <div className="uk-media" style={{ aspectRatio: '16 / 10', borderRadius: 'var(--uk-radius-image, var(--uk-radius-md))', marginBottom: 'var(--uk-space-2)' }}>
          <Image image={post.image} alt="" sizes={sizes} />
        </div>
      ) : null}
      {post.published_at ? (
        <p style={{ margin: 'var(--uk-space-2) 0 0', fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}><DateText iso={post.published_at} locale={locale} /></p>
      ) : null}
      <Title level={level}><a href={post.url} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</a></Title>
      {post.summary ? <p style={{ margin: 'var(--uk-space-2) 0 0', color: 'var(--uk-color-text-muted)' }}>{post.summary}</p> : null}
      {post.author && by ? <p style={{ margin: 'var(--uk-space-2) 0 0', fontSize: 'var(--uk-text-sm)' }}>{by}</p> : null}
    </article>
  );
}

// On a post page the post itself is left out (the platform reads one more for that list, so it still shows as many as
// it asks for). The blog page's own list with no posts shows its no-posts text; any other list shows nothing without
// posts.
export default function PostList(p: Props) {
  const { t } = p;
  const anchor = useId();
  const list = p.posts && typeof p.posts === 'object' ? p.posts : null;
  const items = (Array.isArray(list?.items) ? list.items : []).filter((x) => x && x.url !== p.site?.page.path);
  const own = p.site?.page.kind === 'blog';
  if (!items.length && !(own && t('blog.empty'))) return null;
  return (
    <section id={anchor} style={{ padding: 'var(--uk-space-5) 0 var(--uk-section-sm)' }}>
      <Container>
        {p.heading ? <div style={{ marginBottom: 'var(--uk-space-6)' }}><Heading>{p.heading}</Heading></div> : null}
        {items.length ? (
          <ul className={p.columns === '2' ? 'uk-grid uk-grid--2' : 'uk-grid uk-grid--3'} style={{ rowGap: 'var(--uk-space-7)' }}>
            {items.map((x) => <li key={x.id}><Card post={x} level={p.heading ? 3 : 2} by={t('blog.by', { author: x.author ?? '' })} locale={p.site?.locale} sizes={p.columns === '2' ? '(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(50vw - 60px), 540px' : '(max-width: 560px) calc(100vw - 48px), (max-width: 900px) calc(50vw - 36px), (max-width: 1200px) calc(33.33vw - 48px), 352px'} /></li>)}
          </ul>
        ) : <p style={{ margin: 0, fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('blog.empty')}</p>}
        {list && list.pages > 1 && (list.prev_url || list.next_url) ? (
          <div style={{ marginTop: 'var(--uk-space-7)' }}>
            <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
