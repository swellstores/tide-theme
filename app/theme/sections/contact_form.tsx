import type { ReactNode } from 'react';
import type { SiteInfo } from 'ui-kit';
import { Container, Eyebrow, Heading, Icon, safeUrl, telHref, Text } from 'ui-kit';

// A retired section type (TD23): Swell has no contact-form endpoint, so the form it showed sent nothing; the contact
// details section replaces it. Stored pages still show it: their heading and intro, the store's support email and
// phone (from the store's settings, never typed here: the retired email and phone fields are ignored) and their own
// address and hours. The retired form fields are ignored too.
export const schema = {
  label: 'Contact form',
  retired: true,
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'intro', type: 'textarea', label: 'Intro' },
    { id: 'email_label', type: 'text', label: 'Email label' },
    { id: 'phone_label', type: 'text', label: 'Phone label' },
    { id: 'address_label', type: 'text', label: 'Address label' },
    { id: 'address', type: 'textarea', label: 'Address' },
    { id: 'hours_label', type: 'text', label: 'Hours label' },
    { id: 'hours', type: 'text', label: 'Hours' },
    { id: 'email', type: 'text', label: 'Email address', retired: true },
    { id: 'phone', type: 'text', label: 'Phone number', retired: true },
    { id: 'form_heading', type: 'text', label: 'Form heading', retired: true },
    { id: 'name_field', type: 'text', label: 'Name field label', retired: true },
    { id: 'name_placeholder', type: 'text', label: 'Name placeholder', retired: true },
    { id: 'email_field', type: 'text', label: 'Email field label', retired: true },
    { id: 'email_placeholder', type: 'text', label: 'Email placeholder', retired: true },
    { id: 'topic_field', type: 'text', label: 'Topic field label', retired: true },
    { id: 'topics', type: 'list', label: 'Topics', max: 8, item: [{ id: 'label', type: 'text', label: 'Topic' }], retired: true },
    { id: 'message_field', type: 'text', label: 'Message field label', retired: true },
    { id: 'message_placeholder', type: 'text', label: 'Message placeholder', retired: true },
    { id: 'button_label', type: 'text', label: 'Button label', retired: true },
    { id: 'note', type: 'text', label: 'Small print', retired: true },
  ],
} as const;

type Props = {
  eyebrow?: string; heading?: string; intro?: string; email_label?: string; phone_label?: string; address_label?: string; address?: string;
  hours_label?: string; hours?: string; site?: SiteInfo;
};


function Detail({ icon, label, children }: { icon: 'mail' | 'phone' | 'pin' | 'clock'; label?: string; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <span style={{ display: 'inline-grid', placeItems: 'center', flex: 'none', width: 40, height: 40, borderRadius: 'var(--uk-radius-pill)', background: 'var(--uk-color-accent-soft)', color: 'var(--uk-color-accent)' }}>
        <Icon name={icon} size={20} />
      </span>
      <div style={{ fontSize: 'var(--uk-text-sm)', lineHeight: 1.5, textWrap: 'balance' }}>
        {label ? <strong style={{ display: 'block', marginBottom: 2, color: 'var(--uk-color-ink)' }}>{label}</strong> : null}
        <span style={{ color: 'var(--uk-color-text-muted)' }}>{children}</span>
      </div>
    </div>
  );
}

// Nothing with nothing to show.
export default function ContactForm({ eyebrow, heading, intro, email_label, phone_label, address_label, address, hours_label, hours, site }: Props) {
  const store = site?.store;
  const contact = { email: store?.support_email ? safeUrl(`mailto:${store.support_email}`) : undefined, phone: telHref(store?.support_phone) };
  if (!eyebrow && !heading && !intro && !contact.email && !contact.phone && !address && !hours) return null;
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0' }}>
      <Container>
        <div style={{ maxWidth: 640 }}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {heading ? <Heading level={1} size="xl">{heading}</Heading> : null}
          {intro ? <Text size="lg" tone="muted">{intro}</Text> : null}
          <div style={{ display: 'grid', gap: 'var(--uk-space-5)', marginTop: 'var(--uk-space-7)' }}>
            {contact.email ? (
              <Detail icon="mail" label={email_label}>
                <a href={contact.email} style={{ color: 'inherit', textUnderlineOffset: 3 }}>{store?.support_email}</a>
              </Detail>
            ) : null}
            {contact.phone ? (
              <Detail icon="phone" label={phone_label}>
                <a href={contact.phone} style={{ color: 'inherit', textUnderlineOffset: 3 }}>{store?.support_phone}</a>
              </Detail>
            ) : null}
            {address ? <Detail icon="pin" label={address_label}>{address}</Detail> : null}
            {hours ? <Detail icon="clock" label={hours_label}>{hours}</Detail> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
