import type { Translate } from 'ui-kit';
import { Button, Container, Heading, Icon, Text } from 'ui-kit';

// The page a missing address shows (the 404 page): the merchant's words, a search box (a plain GET form to the search
// page, a search landmark named by its label: the header's search is the page's other one) and a link back to the
// store's home page.
export const schema = {
  label: 'Page not found',
  fields: [
    { id: 'heading', type: 'text', label: 'Heading', retired: true },
    { id: 'text', type: 'textarea', label: 'Text', retired: true },
    { id: 'search_label', type: 'text', label: 'Search field label', retired: true },
    { id: 'search_button', type: 'text', label: 'Search button label', retired: true },
    { id: 'home_label', type: 'text', label: 'Home button label', retired: true },
  ],
} as const;

type Props = { t: Translate };

export default function NotFound({ t }: Props) {
  return (
    <section style={{ padding: 'var(--uk-section-md) 0' }}>
      <Container width="narrow" align="center">
        {t('not_found.title') ? <Heading level={1} size="xl">{t('not_found.title')}</Heading> : null}
        {t('not_found.text') ? <Text size="lg" tone="muted">{t('not_found.text')}</Text> : null}
        <form action="/search" role="search" aria-label={t('search.field') || t('search.search') || undefined} className="uk-focus-within" style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 520, margin: 'var(--uk-space-6) auto 0', padding: '8px 8px 8px 20px', borderRadius: 'var(--uk-radius-pill)', background: 'var(--uk-color-surface)', boxShadow: 'var(--uk-shadow-raised)' }}>
          <span style={{ flex: 'none', color: 'var(--uk-color-text-muted)' }}><Icon name="search" size={20} /></span>
          <input
            type="search"
            name="q"
            aria-label={t('search.field') || t('search.search') || undefined}
            data-site-suggest=""
            style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-ink)' }}
          />
          {t('search.search') ? <button type="submit" className="uk-button uk-button--primary">{t('search.search')}</button> : null}
        </form>
        {t('not_found.back') ? (
          <div className="uk-cluster" style={{ marginTop: 'var(--uk-space-6)' }}>
            <Button href="/" variant="secondary">{t('not_found.back')}</Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
