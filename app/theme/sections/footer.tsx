import type { ReactElement } from 'react';
import { Container, Field, Icon, LocalizationForm, NewsletterFields, newsletterOpen, Notice, PaymentIcons, paymentMarks, safeUrl, sectionColours, telHref } from 'ui-kit';
import type { MenuData, MenuItem, SiteInfo, Translate } from 'ui-kit';

export const schema = {
  label: 'Footer',
  fields: [
    { id: 'menu', type: 'menu', label: 'Menu', default: 'footer_menu' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['columns', 'centered', 'wordmark'], default: 'columns' },
    { id: 'brand', type: 'select', label: 'Brand', options: ['name', 'logo'], default: 'name' },
    { id: 'show_payments', type: 'select', label: 'Payment icons', options: ['show', 'hide'], default: 'show' },
    { id: 'tagline', type: 'textarea', label: 'Tagline' },
    { id: 'note', type: 'text', label: 'Second line' },
    { id: 'currency_label', type: 'text', label: 'Currency label', retired: true },
    { id: 'currency_button', type: 'text', label: 'Currency button label', retired: true },
    { id: 'payments_label', type: 'text', label: 'Payment methods label', retired: true },
    { id: 'newsletter', type: 'select', label: 'Newsletter sign-up', options: ['hide', 'show'], default: 'hide' },
    { id: 'newsletter_heading', type: 'text', label: 'Newsletter heading', retired: true },
    { id: 'email_label', type: 'text', label: 'Email field label', retired: true },
    { id: 'subscribe_label', type: 'text', label: 'Subscribe button label', retired: true },
    { id: 'subscribed_message', type: 'text', label: 'Message after subscribing', retired: true },
    { id: 'subscribe_failed_message', type: 'text', label: 'Message when subscribing fails', retired: true },
    {
      id: 'social', type: 'list', label: 'Social links (when the theme settings have none)', max: 5,
      item: [
        { id: 'icon', type: 'select', label: 'Icon', options: ['instagram', 'youtube', 'facebook'], default: 'instagram' },
        { id: 'label', type: 'text', label: 'Label' },
        { id: 'href', type: 'url', label: 'Link' },
      ],
    },
    { id: 'store_name', type: 'text', label: 'Store name', retired: true },
    { id: 'legal', type: 'text', label: 'Legal line', retired: true },
    { id: 'locale_label', type: 'text', label: 'Country and currency', retired: true },
    { id: 'payments', type: 'list', label: 'Payment methods', max: 8, item: [{ id: 'label', type: 'text', label: 'Name' }], retired: true },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
  // Columns typed into the footer before it showed the store's footer menu: still shown after the menu's columns.
  blocks: { types: ['link_column'], max: 4 },
} as const;

type Props = {
  t: Translate;
  menu?: MenuData | null; layout?: string; brand?: string; show_payments?: string; tagline?: string; note?: string; newsletter?: string;
    social?: { icon?: string; label?: string; href?: string }[]; background_colour?: string; text_colour?: string; accent_colour?: string; site?: SiteInfo; blocks: ReactElement[];
};

const NETWORKS: Record<string, string> = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', pinterest: 'Pinterest', linkedin: 'LinkedIn' };
const NEWSLETTER_ID = 'footer-newsletter';


// A menu link (aria-current on the page's own), else its name.
function menuLink(item: MenuItem) {
  const link = { href: safeUrl(item.url ?? undefined), blank: item.target === '_blank' };
  if (!link.href) return <span style={{ fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)' }}>{item.name}</span>;
  return (
    <a href={link.href} target={link.blank ? '_blank' : undefined} rel={link.blank ? 'noopener' : undefined} aria-current={item.current ? 'page' : undefined} style={{ fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>
      {item.name}
    </a>
  );
}

// A top-level item of the footer menu: a column headed by its name (a link when the item has a URL) with its links, or
// a link of its own.
function column(item: MenuItem, i: number) {
  if (!item.items.length) return <ul key={i} style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}><li>{menuLink(item)}</li></ul>;
  const head = { href: safeUrl(item.url ?? undefined) };
  return (
    <div key={i}>
      <h2 style={{ margin: '0 0 var(--uk-space-4)', fontSize: 'var(--uk-text-xs)', fontWeight: 700, lineHeight: 1.4, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--uk-color-text-subtle)' }}>
        {head.href ? <a href={head.href} aria-current={item.current ? 'page' : undefined} style={{ color: 'inherit' }}>{item.name}</a> : item.name}
      </h2>
      <ul style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>{item.items.map((child, j) => <li key={j}>{menuLink(child)}</li>)}</ul>
    </div>
  );
}

// The store's name, contacts, policies and payment methods come from its settings, the columns from its footer menu
// and the social links from the theme settings (else the footer's own list), each an icon named by its network. The
// newsletter sign-up is optional and shown only when the store takes email sign-ups; its outcome (the page's notice)
// shows above the form. With none of it, there is no footer.
// layout: columns (the brand beside the menu's columns), centered (everything in one centered column, the columns in a
// centered row) or wordmark (columns, ending with the store's name set as large as the page's width allows). brand: the store's name, or the theme
// settings' logo (the name without one). The bottom bar shows the store's payment methods as their brands' marks
// (ui-kit PaymentIcons), never words; show_payments hide: none. It also credits Swell with a link to swell.is, in the
// merchant's words (Store text footer.powered_by; blanked: no credit).
export default function Footer({ t, menu, layout, brand, show_payments, tagline, note, newsletter, social = [], site, blocks, ...colours
}: Props) {
  const store = site?.store;
  const name = store?.name ?? '';
  const contact = {
    email: store?.support_email ? safeUrl(`mailto:${store.support_email}`) : undefined,
    phone: telHref(store?.support_phone),
  };
  const items = (menu?.items ?? []).filter((item) => item && typeof item.name === 'string');
  const brandSocial = site?.brand.social ?? [];
  const links = (brandSocial.length
    ? brandSocial.map((s) => ({ icon: s.network, name: NETWORKS[s.network] ?? s.network, href: safeUrl(s.url) }))
    : social.map((s) => ({ icon: s.icon ?? '', name: s.label || (s.icon ? NETWORKS[s.icon] : '') || '', href: safeUrl(s.href) }))
  ).filter((l) => l.href && l.name);
  const policies = (store?.policies ?? []).map((p) => ({ id: p.id, title: p.title, url: safeUrl(p.url) })).filter((p) => p.url);
  const payments = show_payments === 'hide' ? [] : paymentMarks(store?.payment_methods);
  const credit = t('footer.powered_by');
  const signup = newsletter === 'show' && newsletterOpen(site);
  const currencies = (store?.currencies ?? []).length >= 2;
  // nothing to show (an empty store, nothing typed in): no footer at all
  const shown = name || tagline || note || contact.email || contact.phone || currencies || items.length || blocks.length || signup || policies.length || links.length || payments.length;
  if (!shown) return null;
  const centered = layout === 'centered';
  const logo = brand === 'logo' ? site?.brand.logo ?? null : null;
  return (
    <footer style={{ padding: 'var(--uk-section-sm) 0 var(--uk-space-6)', borderTop: '1px solid var(--uk-color-line)', background: 'var(--uk-color-bg)', textAlign: centered ? 'center' : undefined, ...sectionColours(colours) }}>
      <Container>
        <div className={centered ? undefined : 'uk-split'} style={{ display: centered ? 'grid' : undefined, justifyItems: centered ? 'center' : undefined, gridTemplateColumns: centered ? undefined : 'minmax(0, 1.2fr) minmax(0, 2fr)', gap: 'var(--uk-space-7)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--uk-space-4)', justifyItems: centered ? 'center' : 'start' }}>
            {logo ? (
              <a href="/" aria-label={logo.alt || name || t('navigation.home') || undefined}>
                <img src={logo.url} alt="" width={logo.width} height={logo.height} style={{ display: 'block', width: site?.brand.logo_width ?? 'auto', height: site?.brand.logo_width ? 'auto' : 48, maxWidth: 'min(240px, 100%)', objectFit: 'contain' }} />
              </a>
            ) : name ? (
              <a href="/" style={{ fontFamily: 'var(--uk-font-heading)', fontSize: 'var(--uk-heading-md)', fontWeight: 700, color: 'var(--uk-color-heading)', textDecoration: 'none' }}>{name}</a>
            ) : null}
            {tagline ? <p style={{ maxWidth: 300, margin: 0, color: 'var(--uk-color-text-muted)' }}>{tagline}</p> : null}
            {contact.email || contact.phone ? (
              <address style={{ display: 'grid', gap: 8, fontStyle: 'normal' }}>
                {contact.email ? (
                  <a href={contact.email} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>
                    <Icon name="mail" size={18} />
                    {store?.support_email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a href={contact.phone} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-ink)', textDecoration: 'none' }}>
                    <Icon name="phone" size={18} />
                    {store?.support_phone}
                  </a>
                ) : null}
              </address>
            ) : null}
            <LocalizationForm site={site} label={t('footer.currency')} submit={t('footer.change_currency')} />
          </div>
          {items.length || blocks.length ? (
            <nav aria-label={menu?.name || undefined} style={{ display: centered ? 'flex' : 'grid', flexWrap: centered ? 'wrap' : undefined, justifyContent: centered ? 'center' : undefined, gridTemplateColumns: centered ? undefined : 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--uk-space-6)' }}>
              {items.map(column)}
              {blocks}
            </nav>
          ) : null}
        </div>
        {signup ? (
          <div id={NEWSLETTER_ID} style={{ marginTop: 'var(--uk-space-7)', maxWidth: 520, marginInline: centered ? 'auto' : undefined, textAlign: centered ? 'left' : undefined }}>
            {t('newsletter.title') ? (
              <h2 style={{ margin: '0 0 var(--uk-space-4)', fontSize: 'var(--uk-text-xs)', fontWeight: 700, lineHeight: 1.4, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--uk-color-text-subtle)' }}>{t('newsletter.title')}</h2>
            ) : null}
            <Notice notice={site?.notice} messages={{ subscribed: t('newsletter.subscribed'), subscribe_failed: t('newsletter.failed') }} />
            <form method="post" action="/newsletter" className="uk-inline-form">
              <NewsletterFields site={site} anchor={NEWSLETTER_ID} />
              <div style={{ flex: '1 1 220px' }}>
                <Field label={t('newsletter.email')} name="email" type="email" required autocomplete="email" />
              </div>
              <button className="uk-button uk-button--primary" type="submit">{t('newsletter.subscribe')}</button>
            </form>
          </div>
        ) : null}
        {name || note || credit || policies.length || links.length || payments.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: centered ? 'column-reverse' : undefined, alignItems: 'center', justifyContent: centered ? 'center' : 'space-between', gap: '16px 24px', marginTop: 'var(--uk-space-8)', paddingTop: 'var(--uk-space-5)', borderTop: '1px solid var(--uk-color-line)', fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-subtle)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 20px' }}>
              {name || note ? (
                <p style={{ margin: 0 }}>
                  {name ? `© ${site?.year} ${name}` : null}
                  {name && note ? <span aria-hidden="true" style={{ margin: '0 10px' }}>·</span> : null}
                  {note}
                </p>
              ) : null}
              {credit ? <a href="https://www.swell.is" style={{ color: 'inherit' }}>{credit}</a> : null}
              {policies.length ? (
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', margin: 0, padding: 0, listStyle: 'none' }}>
                  {policies.map((p) => <li key={p.id}><a href={p.url} style={{ color: 'inherit' }}>{p.title}</a></li>)}
                </ul>
              ) : null}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px' }}>
              {links.length ? (
                <ul style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, margin: 0, padding: 0, listStyle: 'none' }}>
                  {links.map((l, i) => (
                    <li key={i}>
                      <a href={l.href} aria-label={l.name} style={{ display: 'inline-grid', placeItems: 'center', width: 36, height: 36, borderRadius: 'var(--uk-radius-pill)', color: 'var(--uk-color-ink)' }}>
                        <Icon name={l.icon as 'instagram'} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              {payments.length ? <PaymentIcons methods={store?.payment_methods} label={t('footer.payment_methods') || 'Payment methods'} /> : null}
            </div>
          </div>
        ) : null}
        {layout === 'wordmark' && name ? (
          <p aria-hidden="true" className="uk-title" style={{ margin: 'var(--uk-space-7) 0 0', fontFamily: 'var(--uk-font-heading)', fontSize: `min(${Math.round(1600 / Math.max(6, name.length))}px, ${Math.round(1250 / Math.max(6, name.length)) / 10}vw)`, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.03em', overflowWrap: 'anywhere', color: 'var(--uk-color-heading)' }}>{name}</p>
        ) : null}
      </Container>
    </footer>
  );
}
