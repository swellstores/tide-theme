import type { PageData, SiteInfo } from 'ui-kit';
import { Container, Heading, RichText } from 'ui-kit';

// A content page from the store (Content › Pages in the dashboard): its title and its text, both written there. On a
// content page's own address it is the page's own (the page's heading, h1); another page shown here has an h2. Wide:
// lined up with the sections around it (the text still at most 72 characters a line); narrow: a centered column. A page
// with no text yet is its title alone, lined up with the header and the sections around it either way, with no band of
// space under it before the next section's own (2026-11-23 usability test: Marram's About title sat indented in a narrow
// column holding nothing else, and a shared About with no text showed a blank band where its empty Story section was).
export const schema = {
  label: 'Page content',
  fields: [
    { id: 'page', type: 'content_page', label: 'Page', default: 'current' },
    { id: 'width', type: 'select', label: 'Text width', options: ['narrow', 'wide'], default: 'narrow' },
  ],
} as const;

type Props = { page?: PageData | null; width?: string; site?: SiteInfo };

// Nothing without a page. A page with no text yet (one only the editor's draft has) shows its title.
export default function PageContent({ page, width = 'narrow', site }: Props) {
  const item = page && typeof page === 'object' ? page : null;
  if (!item || (!item.title && !item.content?.length)) return null;
  const own = site?.page.kind === 'page' && item.url === site.page.path;
  return (
    <section style={{ padding: item.content?.length ? 'var(--uk-space-7) 0 var(--uk-section-sm)' : 'var(--uk-space-7) 0 0' }}>
      <Container width={width === 'wide' || !item.content?.length ? 'wide' : 'narrow'}>
        {item.title ? <Heading level={own ? 1 : 2} size="xl">{item.title}</Heading> : null}
        {item.content?.length ? (
          <div style={{ maxWidth: '72ch', marginTop: 'var(--uk-space-5)', fontSize: 'var(--uk-text-md)', lineHeight: 1.65 }}>
            <RichText value={item.content} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
