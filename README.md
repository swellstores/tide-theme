# Tide

Tide is Swell's free, general-purpose storefront theme for **Wave**, the Swell
storefront app with a visual editor and an AI agent. It gives a new store a
complete, finished-looking storefront on day one: every page type, a header and
footer, and sections that read the store's own Swell data. Its look is
deliberately plain (a white page, neutral colors and system fonts), so it suits
any store and is a clean starting point for developers building their own Wave
themes.

- Listing copy (Swell App Store and the swell.is Theme Store): [`DESCRIPTION.md`](DESCRIPTION.md)
- The installable theme app: [`app/`](app)

## What's inside

**Pages.** A template for every page Wave serves: home, product, category
(`collection`) and the categories list, search, blog and blog post, content
pages (with About and Contact layouts), policies, cart, account, sign-in and the
not-found page. Shoppers check out on Swell's hosted checkout.

**Sections.** Header and footer (in the shared Header and Footer groups, so they
show on every page), announcement bar, hero, image tiles, feature list, story,
stats, testimonials, FAQ, email sign-up, product grid, product details,
collection header, filters and list, search results, blog and post sections,
page content, policy text, contact details and form, cart items and summary,
sign-in and account. Merchants add, move, hide and edit them in the Wave editor.

**Blocks.** Product and collection cards, nav links and link columns, text,
feature items, testimonials, image hotspots and up-sell products.

**Store data, not sample content.** Product grids, category and product pages,
search, menus, the blog and store details come from the store's Swell data. A
section with nothing to show renders nothing rather than made-up content.

**Design settings.** Tide's colors and fonts are tokens in
`theme/config/settings.json`. Fonts, type size, spacing, button shape and the other
style choices are in Wave's Theme tab; Tide adds its own settings there
(`theme/config/settings_content.json`: a sticky header and the product cards'
quick add and color dots). Sections take their own background, text and accent
colors, and the agent restyles the whole store's colors on request. Every
shopper-facing word is in one place, Store text (`theme/config/language.json`).

## How a section is written

A section is a React module, rendered on the server by Wave. It exports its
editor fields as `schema` and its markup as the default export:

```tsx
import { Container, Eyebrow, sectionColours } from 'ui-kit';

export const schema = {
  label: 'Stats',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Eyebrow' },
    { id: 'items', type: 'list', label: 'Figures', max: 4, item: [/* … */], default: [] },
  ],
} as const;

export default function Stats({ eyebrow, items = [] }) {
  /* … */
}
```

Sections import shared components from `ui-kit` (provided by Wave) and send no
JavaScript to the browser; one small script from Wave handles the cart drawer,
variant picker, search suggestions and menus.

## Repository layout

```
app/        the complete theme app as Swell installs it (swell.json, assets/, theme/)
theme/      Tide's own sections, blocks, templates and settings
assets/     preview images
swell.json  the theme app's manifest (type "theme", storefront app "wave")
```

`app/` is assembled from Tide's own files here plus Swell's shared theme core,
which provides the sections every Wave theme has (header, footer, cart,
account, search and the rest). Change Tide's own files, then rebuild `app/`;
don't edit `app/` by hand.

## Installing

Merchants install Tide from the Swell Theme Store, or start a new storefront
with Wave, which begins from Tide. Each storefront keeps its own copy of the
theme files, and the Wave editor offers theme updates when a new version of
Tide is published.

## License

Tide is licensed under the Swell Theme License (`LICENSE`), which covers this repository, the shared theme core in `app/` included.
