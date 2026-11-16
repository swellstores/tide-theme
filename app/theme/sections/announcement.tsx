import { Icon, safeUrl, sectionColours } from 'ui-kit';
import type { SiteInfo } from 'ui-kit';

// The store-wide announcement (theme settings) shows on every page; the bar's own text and link are used only while
// those settings have none. Nothing renders without text. The "·" between the text and the link ends the text, so a
// line never starts with it when the link wraps; phones, where it wraps, don't show it.
export const schema = {
  label: 'Announcement bar',
  fields: [
    { id: 'text', type: 'text', label: 'Text' },
    { id: 'link_label', type: 'text', label: 'Link label' },
    { id: 'link_href', type: 'url', label: 'Link' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Props = { text?: string; link_label?: string; link_href?: string; background_colour?: string; text_colour?: string; site?: SiteInfo };

export default function Announcement({ text, link_label, link_href, site, ...colours }: Props) {
  const own = site?.brand.announcement;
  const shown = own ? { text: own.text, label: own.link_label, href: safeUrl(own.link_url ?? undefined) } : { text, label: link_label, href: safeUrl(link_href) };
  if (!shown.text) return null;
  return (
    <div style={{ ...sectionColours(colours, 'accent'), background: 'var(--uk-color-accent-strong)', color: 'var(--uk-color-on-accent-muted)', fontSize: 'var(--uk-text-xs)', lineHeight: 1.4 }}>
      <div className="uk-container uk-container--wide" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', columnGap: 14, rowGap: 2, minHeight: 40, paddingTop: 8, paddingBottom: 8, textAlign: 'center' }}>
        <span>
          {shown.text}
          {shown.label && shown.href ? <span aria-hidden="true" className="uk-hide-sm" style={{ marginLeft: 14, opacity: 0.6 }}>·</span> : null}
        </span>
        {shown.label && shown.href ? (
          <a href={shown.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', color: 'var(--uk-color-on-accent)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            {shown.label}
            <Icon name="arrow" size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
