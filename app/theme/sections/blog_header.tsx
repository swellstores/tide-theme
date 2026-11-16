import type { BlogData, SiteInfo } from 'ui-kit';
import { Container, Heading, Text } from 'ui-kit';

// A blog's name (a blog category in the dashboard; every post's, "All posts", at /blogs) and the merchant's own intro.
// On the blog's own page it is the page's heading (h1); another blog shown here has an h2.
export const schema = {
  label: 'Blog header',
  fields: [
    { id: 'blog', type: 'blog', label: 'Blog', default: 'current' },
    { id: 'intro', type: 'textarea', label: 'Intro' },
  ],
} as const;

type Props = { blog?: BlogData | null; intro?: string; site?: SiteInfo };

// Nothing without a blog.
export default function BlogHeader({ blog, intro, site }: Props) {
  const item = blog && typeof blog === 'object' ? blog : null;
  if (!item || !item.title) return null;
  const own = site?.page.kind === 'blog' && item.url === site.page.path;
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-space-5)' }}>
      <Container>
        <Heading level={own ? 1 : 2} size="xl">{item.title}</Heading>
        {intro ? <Text size="lg" tone="muted">{intro}</Text> : null}
      </Container>
    </section>
  );
}
