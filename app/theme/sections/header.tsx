import type { ReactElement } from 'react';
import { CartLink, Container, Icon, NavMenu, Notice, sectionColours } from 'ui-kit';
import type { MenuData, SiteInfo, Translate } from 'ui-kit';

export const schema = {
  label: 'Header',
  fields: [
    { id: 'menu', type: 'menu', label: 'Menu', default: 'main_menu' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['left', 'centered'], default: 'left' },
    { id: 'over_hero', type: 'select', label: 'Over the home page\'s first section (a full-width hero image)', options: ['no', 'yes'], default: 'no' },
    { id: 'menu_label', type: 'text', label: 'Menu button label', retired: true },
    { id: 'search_label', type: 'text', label: 'Search label', retired: true },
    { id: 'account_label', type: 'text', label: 'Account label', retired: true },
    { id: 'cart_label', type: 'text', label: 'Cart label', retired: true },
    { id: 'home_label', type: 'text', label: 'Home link label (a logo without alt text)', retired: true },
    { id: 'error_message', type: 'text', label: 'Message when an action fails', retired: true },
    { id: 'store_name', type: 'text', label: 'Store name', retired: true },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
  // Links typed into the header before it showed the store's menu: still shown after the menu's links.
  blocks: { types: ['nav_link'], max: 8 },
} as const;

type Props = {
  t: Translate;
  menu?: MenuData | null; layout?: string; over_hero?: string; background_colour?: string; text_colour?: string; accent_colour?: string;  site?: SiteInfo; blocks: ReactElement[];
};

// A text's width at 16 px, generously: 16 px a CJK or other full-width character, 20 an emoji, 10.5 a capital, 8 any
// other; marks and joiners none.
const WIDE_RE = /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6\u{20000}-\u{3fffd}]/u;
const MAX_NAME_WIDTH = 440; // the store's name as the logo, on one row while there is room
const textWidth = (s: string) =>
  [...s].reduce((w, c) => w + (/[\p{M}\u200d]/u.test(c) ? 0 : /\p{Extended_Pictographic}/u.test(c) ? 20 : WIDE_RE.test(c) ? 16 : /\p{Lu}/u.test(c) ? 10.5 : 8), 0);

// Whether the menu's links fit on the header's row beside the logo, the search box, the account link and the cart, as
// a ui-kit fold class: '' (they fit from 901 px wide; the menu button below), uk-fold-lg (they fit from 1200 px; the
// menu button below) or uk-fold-all (they never fit; the menu button at every width). The widths are generous
// estimates: each link's text (textWidth) with ui-kit's 32 px between links and 22 px for a dropdown's chevron, 100 px a
// stored link, the store's name at 1.7 times its textWidth (26 px type), the logo's width (its most, 240 px, when its
// size is unknown), the search box at its narrowest at 901 px (120 px) and widest from 1200 px (240 px; the row stops
// growing at the container's 1200 px, so that is its tightest wide case, at 1920 px and over), the container's gutters
// and the row's gaps.
function foldOf(menu: MenuData | null | undefined, links: number, logo: number, account: boolean, cart: string) {
  const items = (menu?.items ?? []).filter((i) => i && typeof i.name === 'string');
  const n = items.length + links;
  if (!n) return '';
  const nav = items.reduce((w, i) => w + textWidth(i.name) + (i.items?.length ? 22 : 0), 0) + links * 100 + 32 * (n - 1);
  const icons = 40 + (account ? 40 : 0) + 64 + textWidth(cart) * 0.95 + 12; // search button, account, cart, gaps
  if (nav <= 901 - 96 - 54 - (120 + icons) - logo) return '';
  return nav <= 1200 - 96 - 88 - (240 + icons) - logo ? 'uk-fold-lg' : 'uk-fold-all';
}

// The logo (the theme settings' image, else the store's name) links home, at least min(96px, 30vw) wide (it gives way
// only on phones). An image's link is at most 240 px (its width as foldOf counts it). The store's name takes the width it
// needs, up to 440 px, and foldOf counts all of it, so a long name sends the menu behind its button rather than being
// cut (demo QA, 2026-11-14: "Wrackline Editio…" at 1280 px); where the row runs out (phones), it wraps to two balanced
// lines, then ends in an ellipsis. An image of known size (the upload's) keeps its shape in a box the
// page holds for it while it loads (its width and height attributes and aspect-ratio, its height from its width); one of
// unknown size is 40 px tall, or at most its set width wide, its box its own shape once loaded; either way it is
// contained (never stretched) at the box's left. The menu is the store's (Swell's menu editor): on one row while it fits, else behind the menu button
// (foldOf); the search box narrows at mid widths and hides under 900px (the search button then opens the search page).
// #main-content, after the header and before a failed action's notice (the page's ?notice=), is where the platform's
// skip link goes. The header stays stuck to the top of the window while the page scrolls, unless a theme's settings
// turn sticky_header off (site.theme_settings; without it, on). The platform wraps the section in its own element, as tall
// as the header, so that wrapper is what sticks (styles below; a header's own position: sticky can't leave it), and the
// skip link's target, inside it, scrolls the page to the top instead of sticking with it. Its ui-kit class
// uk-header-sticky (uk-header-sticky--centered for the taller centered layout) sets --uk-header-sticky, which anchors and
// other sticky pieces clear (ui-kit.css).
// layout centered: the logo in the middle of its row (search on the left, account and cart on the right), the menu on a
// row of its own under it. over_hero yes: on the home page only, the header sits over the page's first section with no
// background or rule and light text (its own text color when set), and scrolls away with it; elsewhere it is as ever.
// It is placed from the top of the platform's wrapper (header-over makes the wrapper its containing block), which is where
// the header comes in the page: so under the header group's announcement bar when there is one (the bar stays in view,
// the header over the top of the first section below it) and at the top of the page without one. The editor's frames
// already place every section from its wrapper, so the canvas and the site agree.
export const styles = `
&:has(.uk-header-sticky) { position: sticky; top: 0; z-index: 50; }
&:has(.header-over) { position: relative; }
&:has(.uk-header-sticky) [id="main-content"] { scroll-margin-top: 999999px; }
`;

export default function Header({ t, menu, site, blocks, layout, over_hero, ...colours }: Props) {
  const name = site?.store.name ?? '';
  const logo = site?.brand.logo ?? null;
  const width = site?.brand.logo_width ?? null;
  // the store's CDN resizes: twice the shown width, for sharp screens; the upload's own size, when known, for its shape
  const mark = logo ? {
    src: logo.url.startsWith('https://cdn.swell.store/') && !logo.url.includes('?') ? `${logo.url}?width=${(width ?? 200) * 2}` : logo.url,
    alt: logo.alt || name || t('navigation.home') || 'Home',
    w: logo.width && logo.height ? (width ?? Math.round((40 * logo.width) / logo.height)) : undefined,
    h: logo.width && logo.height ? (width ? Math.round((width * logo.height) / logo.width) : 40) : undefined,
  } : null;
  const account = site?.store.accounts !== 'disabled';
  // the logo link's width as foldOf counts it: the logo's (its size, else its set width, else 240 px) or the store's
  // name, from 96 to 240 px; a logo's link is never wider (TD21 final check: one of unknown size would otherwise take
  // its image's natural width, past its set width)
  const room = mark ? Math.min(Math.max(mark.w ?? width ?? 240, 96), 240) : Math.min(Math.max(textWidth(name) * 1.7, 96), MAX_NAME_WIDTH);
  const fold = foldOf(menu, blocks.length, room, account, t('cart.title'));
  const notice = site?.notice;
  const failed = !!t('errors.try_again') && (notice?.code === 'invalid' || notice?.code === 'unavailable');
  const over = over_hero === 'yes' && site?.page.kind === 'home';
  const sticky = !over && site?.theme_settings?.sticky_header !== false;
  const logoLink = mark || name ? (
    <a href="/" style={{ flex: '0 1 auto', minWidth: 'min(96px, 30vw)', maxWidth: mark ? room : `min(${MAX_NAME_WIDTH}px, 100%)`, overflow: 'hidden', textOverflow: mark ? 'ellipsis' : undefined, whiteSpace: mark ? 'nowrap' : undefined, display: mark ? undefined : '-webkit-box', WebkitBoxOrient: mark ? undefined : 'vertical', WebkitLineClamp: mark ? undefined : 2, lineHeight: mark ? undefined : 1.2, textWrap: mark ? undefined : 'balance', overflowWrap: mark ? undefined : 'anywhere', fontFamily: 'var(--uk-font-heading)', fontSize: 'clamp(21px, 5.4vw, 26px)', fontWeight: 700, letterSpacing: '.01em', color: 'var(--uk-color-heading)', textDecoration: 'none' }}>
      {mark ? (
        <img src={mark.src} alt={mark.alt} width={mark.w} height={mark.h} style={{ display: 'block', width: mark.w ?? 'auto', height: mark.w || width ? 'auto' : 40, maxWidth: !mark.w && width ? `min(${width}px, 100%)` : '100%', maxHeight: 'min(64px, 12vw)', aspectRatio: mark.w ? `${mark.w} / ${mark.h}` : undefined, objectFit: 'contain', objectPosition: 'left center', margin: layout === 'centered' ? '0 auto' : undefined }} />
      ) : name}
    </a>
  ) : null;
  const searchButton = (
    <button type="submit" aria-label={t('search.search') || 'Search'} style={{ display: 'inline-grid', placeItems: 'center', width: 'clamp(32px, 10vw, 40px)', height: 40, padding: 0, border: 0, borderRadius: 'var(--uk-radius-pill)', background: 'transparent', color: 'var(--uk-color-ink)', cursor: 'pointer' }}>
      <Icon name="search" size={20} />
    </button>
  );
  const accountLink = account ? (
    <a href="/account" aria-label={t('account.title') || 'Account'} style={{ display: 'inline-grid', placeItems: 'center', width: 'clamp(32px, 10vw, 40px)', height: 40, borderRadius: 'var(--uk-radius-pill)', color: 'var(--uk-color-ink)' }}>
      <Icon name="user" size={20} />
    </a>
  ) : null;
  const after = (
    <>
      <span id="main-content" tabIndex={-1} />
      {failed ? (
        <Container>
          <div style={{ paddingTop: 'var(--uk-space-4)' }}>
            <Notice notice={notice} messages={{ invalid: t('errors.try_again')!, unavailable: t('errors.try_again')! }} />
          </div>
        </Container>
      ) : null}
    </>
  );
  if (layout === 'centered' || over) {
    const centered = layout === 'centered';
    return (
      <>
        <header className={over ? 'header-over' : sticky ? (centered ? 'uk-header-sticky uk-header-sticky--centered' : 'uk-header-sticky') : undefined} style={{ position: over ? 'absolute' : 'sticky', top: 0, left: over ? 0 : undefined, right: over ? 0 : undefined, zIndex: 50, background: over ? undefined : 'var(--uk-color-bg)', borderBottom: over ? undefined : '1px solid var(--uk-color-line)', ...sectionColours(over ? { ...colours, text_colour: colours.text_colour || '#ffffff' } : colours) }}>
          <Container>
            <div style={{ display: 'grid', gridTemplateColumns: centered ? 'minmax(0, 1fr) auto minmax(0, 1fr)' : 'auto minmax(0, 1fr) auto', alignItems: 'center', gap: 'clamp(8px, 3vw, 32px)', minHeight: 76 }}>
              {centered ? (
                <form action="/search" role="search" aria-label={t('search.search') || 'Search'} style={{ display: 'flex', alignItems: 'center', marginLeft: -8 }}>{searchButton}</form>
              ) : logoLink}
              {centered ? logoLink : <div className={fold || undefined} style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}><NavMenu menu={menu} label={t('navigation.menu')}>{blocks.map((b) => <li key={b.key}>{b}</li>)}</NavMenu></div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                {centered ? null : <form action="/search" role="search" aria-label={t('search.search') || 'Search'} style={{ display: 'flex', alignItems: 'center' }}>{searchButton}</form>}
                {accountLink}
                <CartLink label={t('cart.title')} />
              </div>
            </div>
            {centered ? (
              <div className="uk-fold-lg" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 'var(--uk-space-3)' }}>
                <NavMenu menu={menu} label={t('navigation.menu')}>{blocks.map((b) => <li key={b.key}>{b}</li>)}</NavMenu>
              </div>
            ) : null}
          </Container>
        </header>
        {after}
      </>
    );
  }
  return (
    <>
      <header className={sticky ? 'uk-header-sticky' : undefined} style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--uk-color-bg)', borderBottom: '1px solid var(--uk-color-line)', ...sectionColours(colours) }}>
        <Container>
          <div className={fold || undefined} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 3vw, 44px)', minHeight: 76 }}>
            {mark || name ? (
              <a href="/" style={{ flex: '0 1 auto', minWidth: 'min(96px, 30vw)', maxWidth: mark ? room : `min(${MAX_NAME_WIDTH}px, 100%)`, overflow: 'hidden', textOverflow: mark ? 'ellipsis' : undefined, whiteSpace: mark ? 'nowrap' : undefined, display: mark ? undefined : '-webkit-box', WebkitBoxOrient: mark ? undefined : 'vertical', WebkitLineClamp: mark ? undefined : 2, lineHeight: mark ? undefined : 1.2, textWrap: mark ? undefined : 'balance', overflowWrap: mark ? undefined : 'anywhere', fontFamily: 'var(--uk-font-heading)', fontSize: 'clamp(21px, 5.4vw, 26px)', fontWeight: 700, letterSpacing: '.01em', color: 'var(--uk-color-heading)', textDecoration: 'none' }}>
                {mark ? (
                  <img src={mark.src} alt={mark.alt} width={mark.w} height={mark.h} style={{ display: 'block', width: mark.w ?? 'auto', height: mark.w || width ? 'auto' : 40, maxWidth: !mark.w && width ? `min(${width}px, 100%)` : '100%', maxHeight: 'min(64px, 12vw)', aspectRatio: mark.w ? `${mark.w} / ${mark.h}` : undefined, objectFit: 'contain', objectPosition: 'left center' }} />
                ) : name}
              </a>
            ) : null}
            <NavMenu menu={menu} label={t('navigation.menu')}>{blocks.map((b) => <li key={b.key}>{b}</li>)}</NavMenu>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              <form action="/search" role="search" aria-label={t('search.search') || 'Search'} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="uk-hide-sm">
                  <input className="uk-input" type="search" name="q" aria-label={t('search.search') || 'Search'} placeholder={t('search.search')} data-site-suggest="" style={{ width: 'clamp(120px, 14vw, 240px)', minHeight: 40, padding: '0 16px', borderRadius: 'var(--uk-radius-pill)' }} />
                </span>
                <button type="submit" aria-label={t('search.search') || 'Search'} style={{ display: 'inline-grid', placeItems: 'center', width: 'clamp(32px, 10vw, 40px)', height: 40, padding: 0, border: 0, borderRadius: 'var(--uk-radius-pill)', background: 'transparent', color: 'var(--uk-color-ink)', cursor: 'pointer' }}>
                  <Icon name="search" size={20} />
                </button>
              </form>
              {account ? (
                <a href="/account" aria-label={t('account.title') || 'Account'} style={{ display: 'inline-grid', placeItems: 'center', width: 'clamp(32px, 10vw, 40px)', height: 40, borderRadius: 'var(--uk-radius-pill)', color: 'var(--uk-color-ink)' }}>
                  <Icon name="user" size={20} />
                </a>
              ) : null}
              <CartLink label={t('cart.title')} />
            </div>
          </div>
        </Container>
      </header>
      <span id="main-content" tabIndex={-1} />
      {failed ? (
        <Container>
          <div style={{ paddingTop: 'var(--uk-space-4)' }}>
            <Notice notice={notice} messages={{ invalid: t('errors.try_again')!, unavailable: t('errors.try_again')! }} />
          </div>
        </Container>
      ) : null}
    </>
  );
}
