import type { ReactNode } from 'react';
import type { SiteInfo, Translate } from 'ui-kit';
import { Container, Eyebrow, Heading, Icon, safeUrl, sectionColours, telHref, Text } from 'ui-kit';

// How to reach the store: its support email and phone from the store's settings (an email link and a call link), its
// social links from the theme settings, and the merchant's own address and opening hours, which Swell doesn't hold
// (empty until written here). Nothing from the store's settings is typed in here.
export const schema = {
  label: 'Contact details',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Contact us' },
    { id: 'intro', type: 'textarea', label: 'Intro' },
    { id: 'email_label', type: 'text', label: 'Email label', retired: true },
    { id: 'phone_label', type: 'text', label: 'Phone label', retired: true },
    { id: 'address_label', type: 'text', label: 'Address label', retired: true },
    { id: 'address', type: 'textarea', label: 'Address (one line per line)' },
    { id: 'hours_label', type: 'text', label: 'Hours label', retired: true },
    { id: 'hours', type: 'textarea', label: 'Opening hours (one line per line)' },
    { id: 'social_label', type: 'text', label: 'Social links label', retired: true },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = {
  t: Translate;
  eyebrow?: string; heading?: string; intro?: string; address?: string;   hours?: string; background_colour?: string; text_colour?: string; accent_colour?: string; site?: SiteInfo;
};

const NETWORKS: Record<string, string> = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', pinterest: 'Pinterest', linkedin: 'LinkedIn' };


const lines = (text: string | undefined) => String(text ?? '').split('\n').map((t) => t.trim()).filter(Boolean);

function Detail({ icon, label, children }: { icon: 'mail' | 'phone' | 'pin' | 'clock' | 'chat'; label?: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <span style={{ display: 'inline-grid', placeItems: 'center', flex: 'none', width: 40, height: 40, borderRadius: 'var(--uk-radius-pill)', background: 'var(--uk-color-accent-soft)', color: 'var(--uk-color-accent)' }}>
        <Icon name={icon} size={20} />
      </span>
      <div style={{ display: 'grid', gap: 6, justifyItems: 'start', fontSize: 'var(--uk-text-sm)', lineHeight: 1.5 }}>
        {label ? <strong style={{ color: 'var(--uk-color-ink)' }}>{label}</strong> : null}
        {children}
      </div>
    </div>
  );
}

export default function ContactDetails({ t, eyebrow, heading, intro, address, hours, site, ...colours }: Props) {
  const store = site?.store;
  const contact = { email: store?.support_email ? safeUrl(`mailto:${store.support_email}`) : undefined, phone: telHref(store?.support_phone) };
  const place = lines(address);
  const open = lines(hours);
  const social = (site?.brand.social ?? []).map((s) => ({ icon: s.network, name: NETWORKS[s.network] ?? s.network, href: safeUrl(s.url) })).filter((s) => s.href);
  if (!contact.email && !contact.phone && !place.length && !open.length && !social.length) return null;
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0', ...sectionColours(colours) }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 'var(--uk-space-8)', alignItems: 'start' }}>
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {heading ? <Heading>{heading}</Heading> : null}
            {intro ? <Text tone="muted">{intro}</Text> : null}
          </div>
          <address style={{ display: 'grid', gap: 'var(--uk-space-5)', fontStyle: 'normal' }}>
            {contact.email ? (
              <Detail icon="mail" label={t('common.email')}>
                <a className="uk-button uk-button--secondary" href={contact.email}>{store?.support_email}</a>
              </Detail>
            ) : null}
            {contact.phone ? (
              <Detail icon="phone" label={t('common.phone')}>
                <a className="uk-button uk-button--secondary" href={contact.phone}>{store?.support_phone}</a>
              </Detail>
            ) : null}
            {place.length ? <Detail icon="pin" label={t('contact.address')}>{place.map((t, i) => <span key={i} style={{ color: 'var(--uk-color-text-muted)' }}>{t}</span>)}</Detail> : null}
            {open.length ? <Detail icon="clock" label={t('contact.hours')}>{open.map((t, i) => <span key={i} style={{ color: 'var(--uk-color-text-muted)' }}>{t}</span>)}</Detail> : null}
            {social.length ? (
              <Detail icon="chat" label={t('contact.follow_us')}>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 2, margin: 0, padding: 0, listStyle: 'none' }}>
                  {social.map((s, i) => (
                    <li key={i}>
                      <a href={s.href} aria-label={s.name} style={{ display: 'inline-grid', placeItems: 'center', width: 36, height: 36, borderRadius: 'var(--uk-radius-pill)', color: 'var(--uk-color-ink)' }}>
                        <Icon name={s.icon as 'instagram'} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              </Detail>
            ) : null}
          </address>
        </div>
      </Container>
    </section>
  );
}
