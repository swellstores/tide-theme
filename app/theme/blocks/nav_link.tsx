import { safeUrl } from 'ui-kit';
import type { SiteInfo } from 'ui-kit';

// Retired: the header shows the store's menu. Links stored before that still render, after the menu's links, until
// the theme update moves them into the menu. The link to the page shown is marked from the page's address.
export const schema = {
  label: 'Navigation link',
  retired: true,
  fields: [
    { id: 'label', type: 'text', label: 'Label' },
    { id: 'href', type: 'url', label: 'Link' },
    { id: 'current', type: 'select', label: 'Current page', options: ['no', 'yes'], retired: true },
  ],
} as const;

export default function NavLink({ label, href, site }: { label?: string; href?: string; site?: SiteInfo }) {
  const link = { href: safeUrl(href) };
  return (
    <a className="uk-nav-link" href={link.href} aria-current={link.href !== undefined && link.href === site?.page.path ? 'page' : undefined}>
      {label}
    </a>
  );
}
