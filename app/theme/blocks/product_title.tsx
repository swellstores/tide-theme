import type { SectionContext, SiteInfo } from 'ui-kit';
import { Heading, sectionProduct } from 'ui-kit';

// A product section's block: the product's name, the page's heading (h1) on its own page, else an h2.
export const schema = { label: 'Title', icon: 'text', fields: [] } as const;

type Props = { site?: SiteInfo; section?: SectionContext };

export default function ProductTitle({ site, section }: Props) {
  const item = sectionProduct(section);
  if (!item) return null;
  const own = site?.page.kind === 'product' && item.url === site.page.path;
  return <Heading level={own ? 1 : 2} size="xl">{item.name}</Heading>;
}
