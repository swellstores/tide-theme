import type { PolicyData, SiteInfo } from 'ui-kit';
import { Container, Heading, RichText } from 'ui-kit';

// One of the store's policies (refund, privacy or terms, as written in the store's settings): its title and its text.
// On a policy's own address it is the page's own (the page's heading, h1); another policy shown here has an h2.
export const schema = {
  label: 'Policy',
  fields: [
    { id: 'policy', type: 'policy', label: 'Policy', default: 'current' },
  ],
} as const;

type Props = { policy?: PolicyData | null; site?: SiteInfo };

// Nothing without a policy (a store that has not written that one).
export default function PolicyText({ policy, site }: Props) {
  const item = policy && typeof policy === 'object' ? policy : null;
  if (!item) return null;
  const own = site?.page.kind === 'policy' && item.url === site.page.path;
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-section-sm)' }}>
      <Container width="narrow">
        {item.title ? <Heading level={own ? 1 : 2} size="xl">{item.title}</Heading> : null}
        {item.content?.length ? (
          <div style={{ marginTop: 'var(--uk-space-5)', fontSize: 'var(--uk-text-md)', lineHeight: 1.65 }}>
            <RichText value={item.content} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
