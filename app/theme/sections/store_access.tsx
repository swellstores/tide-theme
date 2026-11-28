import type { SiteInfo, Translate } from 'ui-kit';
import { Container, Heading, safeUrl, telHref } from 'ui-kit';

// The wall (Store access, the storefront's setting: never the theme's). While the whole store is for approved customers
// only, Wave shows this page in place of any other to a shopper who isn't approved, except on the sign-in pages, the
// store's application page and its policies; while prices are for approved customers only, on the cart. Wave decides who
// sees it, before the theme renders; the theme only styles it (templates/store-access.json, this section). It stands
// alone, without the header and footer groups (their menus, search and cart would show the store), so it brings the
// store's logo or name, its phone and email (from Swell, when set) and its policies. A guest can sign in, create an
// account when the store takes them, or apply; a signed-in customer who isn't approved yet can apply or sign out (signing
// in again would only bring them back here). The words are Store text (store_access).
export const schema = {
  label: 'Store access',
  fields: [],
} as const;

type Props = { site?: SiteInfo; t: Translate };

export default function StoreAccess({ site, t }: Props) {
  const access = site?.store_access;
  const signedIn = site?.shopper?.signed_in === true;
  const prices = access?.mode === 'prices';
  const title = prices ? t('store_access.prices_title') : signedIn ? t('store_access.pending_title') : t('store_access.title');
  const text = prices ? t('store_access.prices_text') : signedIn ? t('store_access.pending_text') : t('store_access.text');
  const name = site?.store.name ?? '';
  const logo = site?.brand.logo ?? null;
  const width = site?.brand.logo_width ?? null;
  const back = site?.page.path || '/';
  const query = typeof site?.page.query === 'string' && site.page.query.startsWith('?') ? site.page.query : '';
  const ret = `${encodeURIComponent(`${back}${query}`.length <= 512 ? `${back}${query}` : back)}&reason=store_access`; // the sign-in page says why (site.sign_in)
  const phone = site?.store.support_phone ?? null;
  const email = site?.store.support_email ?? null;
  const to = { apply: safeUrl(access?.apply ?? undefined), tel: telHref(phone) };
  const apply = to.apply;
  const tel = to.tel;
  const policies = (site?.store.policies ?? []).map((p) => ({ id: p.id, title: p.title, url: safeUrl(p.url) })).filter((p) => p.title && p.url);
  const accounts = site?.store.accounts !== 'disabled';
  // the store's CDN resizes: twice the shown width, for sharp screens; the upload's own size, when known, for its shape
  const mark = logo ? {
    src: logo.url.startsWith('https://cdn.swell.store/') && !logo.url.includes('?') ? `${logo.url}?width=${(width ?? 150) * 2}` : logo.url,
    w: logo.width && logo.height ? (width ?? Math.round((40 * logo.width) / logo.height)) : undefined,
    h: logo.width && logo.height ? (width ? Math.round((width * logo.height) / logo.width) : 40) : undefined,
  } : null;
  return (
    <div className="uk-store-access" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--uk-color-muted-bg)' }}>
      <header style={{ padding: 'var(--uk-space-5) 0' }}>
        <Container>
          {mark || name ? (
            <a href="/" style={{ display: 'inline-block', maxWidth: 220, fontFamily: 'var(--uk-font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--uk-color-heading)', textDecoration: 'none' }}>
              {mark ? (
                <img
                  src={mark.src} alt={logo?.alt || name} width={mark.w} height={mark.h}
                  style={{ display: 'block', width: width ? `min(${width}px, 100%)` : 'auto', height: 'auto', maxHeight: 44, objectFit: 'contain', objectPosition: 'left center' }}
                />
              ) : name}
            </a>
          ) : null}
        </Container>
      </header>
      <main id="main-content" tabIndex={-1} style={{ flex: '1 0 auto', paddingBottom: 'var(--uk-space-8)' }}>
        <Container>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(24px, 5vw, 44px)', border: '1px solid var(--uk-color-line)', borderRadius: 'var(--uk-radius-lg)', background: 'var(--uk-color-surface)' }}>
            {title ? <Heading level={1} size="md">{title}</Heading> : null}
            {text ? <p style={{ margin: '12px 0 0', fontSize: 'var(--uk-text-sm)', lineHeight: 1.6, color: 'var(--uk-color-text-muted)' }}>{text}</p> : null}
            <div className="uk-cluster" style={{ marginTop: 24 }}>
              {!signedIn && t('store_access.sign_in') ? <a className="uk-button uk-button--primary" href={`/account/login?return=${ret}`}>{t('store_access.sign_in')}</a> : null}
              {apply && t('store_access.apply') ? <a className={`uk-button ${signedIn ? 'uk-button--primary' : 'uk-button--secondary'}`} href={to.apply}>{t('store_access.apply')}</a> : null}
              {!signedIn && !apply && accounts && t('store_access.create_account') ? <a className="uk-button uk-button--secondary" href={`/account/signup?return=${ret}`}>{t('store_access.create_account')}</a> : null}
              {signedIn && t('store_access.sign_out') ? (
                <form method="post" action="/account/logout" style={{ margin: 0 }}>
                  <button type="submit" className="uk-button uk-button--secondary">{t('store_access.sign_out')}</button>
                </form>
              ) : null}
            </div>
            {(phone && tel) || email ? (
              <p style={{ margin: '20px 0 0', fontSize: 13, color: 'var(--uk-color-text-muted)' }}>
                {t('store_access.questions')}{' '}
                {phone && tel ? <a href={to.tel} style={{ color: 'inherit', fontWeight: 600 }}>{phone}</a> : null}
                {phone && tel && email ? ' · ' : null}
                {email ? <a href={`mailto:${email}`} style={{ color: 'inherit', fontWeight: 600 }}>{email}</a> : null}
              </p>
            ) : null}
          </div>
        </Container>
      </main>
      {name || policies.length ? (
        <footer style={{ padding: 'var(--uk-space-5) 0', borderTop: '1px solid var(--uk-color-line)', fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-subtle)' }}>
          <Container>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 20px' }}>
              {name ? <p style={{ margin: 0 }}>{`© ${site?.year ?? ''} ${name}`}</p> : null}
              {policies.length ? (
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', margin: 0, padding: 0, listStyle: 'none' }}>
                  {policies.map((p) => <li key={p.id}><a href={p.url!} style={{ color: 'inherit' }}>{p.title}</a></li>)}
                </ul>
              ) : null}
            </div>
          </Container>
        </footer>
      ) : null}
    </div>
  );
}
