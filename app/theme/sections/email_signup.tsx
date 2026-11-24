import { useId } from 'react';
import { Container, Heading, NewsletterFields, newsletterOpen, Notice, Section, sectionColours, Text } from 'ui-kit';
import type { SiteInfo, Translate } from 'ui-kit';

export const schema = {
  label: 'Newsletter',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading', default: 'Stay in touch' },
    { id: 'text', type: 'textarea', label: 'Text', default: 'Sign up to get emails from us.' },
    { id: 'email_label', type: 'text', label: 'Email field label', retired: true },
    { id: 'placeholder', type: 'text', label: 'Placeholder', retired: true },
    { id: 'button_label', type: 'text', label: 'Button label', default: 'Subscribe' },
    { id: 'note', type: 'text', label: 'Small print' },
    { id: 'subscribed_message', type: 'text', label: 'Message after subscribing', retired: true },
    { id: 'subscribe_failed_message', type: 'text', label: 'Message when subscribing fails', retired: true },
    { id: 'tone', type: 'select', label: 'Background', options: ['accent', 'muted'], default: 'accent' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Props = {
  t: Translate;
  heading?: string; text?: string; button_label?: string; note?: string; tone?: string; background_colour?: string; text_colour?: string; site?: SiteInfo;
};

// The store's email sign-up: a plain form that adds the shopper to the store's customers with email marketing on
// (POST /newsletter, with a field bots fill and people never see), and returns to this page at this section (its id,
// from useId, which the platform prefixes with the section's id), where the outcome shows in the store's words.
// Shown only when the store takes email sign-ups (its settings' email opt-in isn't off) and its settings could be read.
// With neither a heading nor a text of its own it is headed by the Store text's newsletter heading (2026-11-23 usability
// test: a build that emptied the theme's words left a bare email box). tone muted: the page's muted band (a theme's
// quiet band, which follows the merchant's colors) with the page's text and the main button, in place of the accent band.
export default function EmailSignup({ t, heading, text, button_label, note, site, tone, ...colours }: Props) {
  const anchor = useId();
  if (!site || !newsletterOpen(site)) return null;
  const muted = tone === 'muted' && !colours.background_colour;
  const band = sectionColours(colours, muted ? 'page' : 'accent');
  const title = heading || (text ? '' : t('newsletter.heading'));
  return (
    <div id={anchor}>
      <Section tone={muted ? 'muted' : 'accent'} space="sm" style={{ ...sectionColours(colours, muted ? 'page' : 'accent') }}>
        <Container>
          <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'center', gap: 'var(--uk-space-8)' }}>
            <div>
              {title ? <Heading>{title}</Heading> : null}
              {text ? <Text tone="muted">{text}</Text> : null}
            </div>
            <div>
              <Notice notice={site.notice} messages={{ subscribed: t('newsletter.subscribed'), subscribe_failed: t('newsletter.failed') }} />
              <form method="post" action="/newsletter" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <NewsletterFields site={site} anchor={anchor} />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  aria-label={t('newsletter.email') || undefined}
                  placeholder={t('newsletter.placeholder')}
                  className="uk-input"
                  style={{ flex: '1 1 220px', minWidth: 0, minHeight: 50, padding: '0 22px', borderRadius: 'var(--uk-radius-pill)', borderColor: !muted && band?.background ? 'var(--uk-color-on-accent-muted)' : undefined }}
                />
                <button type="submit" className={muted ? 'uk-button uk-button--primary' : 'uk-button uk-button--inverse'} style={{ flex: 'none', minHeight: 50 }}>{button_label}</button>
              </form>
              {note ? <p style={{ margin: '12px 0 0 22px', fontSize: 'var(--uk-text-xs)', color: muted ? 'var(--uk-color-text-muted)' : 'var(--uk-color-on-accent-muted)' }}>{note}</p> : null}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
