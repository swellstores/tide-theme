import type { AppPageData } from 'ui-kit';
import { Card, Container, Grid, Heading, Image, RichText, Text } from 'ui-kit';

// An installed app's own page (a course, a lesson, a booking): what the app's answer gives every page of that kind, its
// title, image, text and a list of items that each link to their own page. The app writes it all; a page it has no
// words for shows nothing. Every theme gets this layout for app pages it has no layout of its own for
// (templates/app.json), and a theme may add one per page type (templates/app.<app>.<page>.json).
export const schema = {
  label: 'App page',
  fields: [
    { id: 'page', type: 'app_page', label: 'App page' },
    { id: 'width', type: 'select', label: 'Text width', options: ['narrow', 'wide'], default: 'wide' },
    { id: 'columns', type: 'select', label: 'Items per row', options: ['2', '3', '4'], default: '3' },
  ],
} as const;

type Props = { page?: AppPageData | null; width?: string; columns?: string };

export default function AppPage({ page, width = 'wide', columns = '3' }: Props) {
  const view = page && typeof page === 'object' ? page.view : null;
  if (!view || (!view.title && !view.body.length && !view.image && !view.items.length)) return null;
  const cols = columns === '2' ? 2 : columns === '4' ? 4 : 3;
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-section-sm)' }}>
      <Container width={width === 'narrow' ? 'narrow' : 'wide'}>
        {view.title ? <Heading level={1} size="xl">{view.title}</Heading> : null}
        {view.image ? (
          <div className="uk-media" style={{ marginTop: 'var(--uk-space-5)', borderRadius: 'var(--uk-radius-md)', overflow: 'hidden', maxWidth: '60rem' }}>
            <Image image={view.image} sizes="(min-width: 960px) 960px, 100vw" priority />
          </div>
        ) : null}
        {view.body.length ? (
          <div style={{ maxWidth: '72ch', marginTop: 'var(--uk-space-5)', fontSize: 'var(--uk-text-md)', lineHeight: 1.65 }}>
            <RichText value={view.body} />
          </div>
        ) : null}
        {view.items.length ? (
          <div style={{ marginTop: 'var(--uk-space-6)' }}>
            <Grid columns={cols} gap="md">
              {view.items.map((item, i) => (
                <Card key={`${i}-${item.url ?? item.title}`} tone="outline">
                  {item.image ? (
                    <div className="uk-media" style={{ aspectRatio: '4 / 3', marginBottom: 'var(--uk-space-3)', borderRadius: 'var(--uk-radius-sm)', overflow: 'hidden' }}>
                      <Image image={item.image} sizes="(min-width: 960px) 320px, 100vw" />
                    </div>
                  ) : null}
                  <Heading level={2} size="md">{item.url ? <a href={item.url}>{item.title}</a> : item.title}</Heading>
                  {item.text ? <div style={{ marginTop: 'var(--uk-space-2)' }}><Text tone="muted">{item.text}</Text></div> : null}
                </Card>
              ))}
            </Grid>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
