import { useId } from 'react';
import type { CartData, CartItem, ProductList, SiteInfo, Translate } from 'ui-kit';
import { CartAmount, cartLineId, cartLineText, CartQuantity, Container, Heading, Image, Notice, SubscribeSwitch } from 'ui-kit';

// The shopper's cart: its lines with their quantities, each changed by plain forms that work without scripts (the
// platform script sends them without a page load: this section and the cart summary are also the cart drawer). The
// quantity controls and Remove are ui-kit's CartQuantity (its forms, ids, fragments and notice target), so a fix to
// them reaches every theme; this section lays the line out. Each line has an id (the section's own, from useId, which
// the platform prefixes with the section's id, then -line-<its id>: no other cart section on the page shares it). A
// cart action's outcome is a notice in the store's words (Store text); a cart that couldn't be read shows that notice
// instead of the empty cart. The unit price and the line total are ui-kit CartAmounts, so the platform script changes
// them the moment a quantity changes (the optimistic cart), before the cart answers.
export const schema = {
  label: 'Cart items',
  fields: [
    { id: 'cart', type: 'cart', label: 'Cart', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading', retired: true },
    { id: 'empty_label', type: 'text', label: 'Empty cart text', retired: true },
    { id: 'continue_label', type: 'text', label: 'Continue shopping link', retired: true },
    { id: 'continue_href', type: 'url', label: 'Continue shopping link address', default: '/products' },
    { id: 'products', type: 'product_list', label: 'The cart\'s products (their plans: switch a line to a subscription)', max: 8, default: { from: 'cart_products', limit: 8 } },
    { id: 'quantity_label', type: 'text', label: 'Quantity (for screen readers)', retired: true },
    { id: 'update_label', type: 'text', label: 'Update button', retired: true },
    { id: 'decrease_label', type: 'text', label: '"−" button (for screen readers)', retired: true },
    { id: 'increase_label', type: 'text', label: '"+" button (for screen readers)', retired: true },
    { id: 'remove_label', type: 'text', label: 'Remove button', retired: true },
    { id: 'subscription_label', type: 'text', label: 'Subscription line', retired: true },
    { id: 'invalid_message', type: 'text', label: 'Message: the change was refused', retired: true },
    { id: 'unavailable_message', type: 'text', label: 'Message: the cart couldn\'t be read or changed', retired: true },
    { id: 'rate_limited_message', type: 'text', label: 'Message: too many tries', retired: true },
    { id: 'session_reset_message', type: 'text', label: 'Message: the session was reset', retired: true },
    { id: 'checkout_unavailable_message', type: 'text', label: 'Message: checkout isn\'t available', retired: true },
    { id: 'item_unavailable_message', type: 'text', label: 'Message: the item can\'t be added', retired: true },
    { id: 'quantity_unavailable_message', type: 'text', label: 'Message: the quantity isn\'t available', retired: true },
    { id: 'partial_message', type: 'text', label: 'Message: some changes weren\'t saved', retired: true },
  ],
} as const;

type Props = {
  t: Translate;
  cart?: CartData | null; continue_href?: string;       site?: SiteInfo; products?: ProductList | null;
};

// One line: its image (decorative: the name beside it), name (a link when it is for sale), options (else variant), plan,
// unit price and total, then its quantity controls and Remove on a row of their own (under the name and the total, so a
// phone has room for them).
function Line({ item, p, anchor }: { item: CartItem; p: Props; anchor: string }) {
  const { t } = p;
  const name = item.product.name;
  const labels = { subscription: t('cart.subscription'), decrease: t('cart.decrease'), increase: t('cart.increase'), quantity: t('common.quantity'), update: t('cart.update'), remove: t('common.remove') };
  const { details, plan } = cartLineText(item, labels);
  // the line's own product (its plans and quantity rules), when the cart's products list has it
  const product = p.products?.items?.find((x) => x.url === item.product.url);
  return (
    <li id={cartLineId(anchor, item)} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr) auto', gap: 'var(--uk-space-3) var(--uk-space-4)', alignItems: 'start', padding: 'var(--uk-space-5) 0', borderBottom: '1px solid var(--uk-color-line)' }}>
      <div className="uk-media" style={{ width: 72, height: 72, borderRadius: 'var(--uk-radius-sm)' }}>
        {item.product.image ? <Image image={item.product.image} alt="" width={144} height={144} sizes="72px" /> : null}
      </div>
      <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--uk-color-ink)' }}>
          {item.product.url ? <a href={item.product.url} style={{ color: 'inherit', textDecoration: 'none' }}>{name}</a> : name}
        </p>
        {details.length ? <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{details.join(' · ')}</p> : null}
        {plan ? <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>{plan}</p> : null}
        <p style={{ margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}><CartAmount item={item} of="price" /></p>
      </div>
      <p style={{ margin: 0, fontWeight: 600, color: 'var(--uk-color-ink)', whiteSpace: 'nowrap' }}><CartAmount item={item} of="total" /></p>
      <div style={{ gridColumn: '2 / -1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <CartQuantity item={item} anchor={anchor} labels={labels} step={product?.quantity?.step} min={product?.quantity?.min} />
        <SubscribeSwitch
          item={item} anchor={anchor} product={product}
          labels={{ switch: (percent: number | null) => (percent ? t('cart.switch_save', { percent }) : t('cart.switch')) }}
        />
      </div>
    </li>
  );
}

// Nothing off the cart page (no cart). The heading is the cart page's (h1).
export default function CartItems(p: Props) {
  const { t } = p;
  const cart = p.cart && typeof p.cart === 'object' ? p.cart : null;
  if (!cart) return null;
  const messages = {
    invalid: t('errors.try_again'), unavailable: t('cart.unavailable'), rate_limited: t('errors.rate_limited'), session_reset: t('errors.session_reset'),
    checkout_unavailable: t('cart.checkout_unavailable'), item_unavailable: t('cart.item_unavailable'), quantity_unavailable: t('cart.quantity_unavailable'),
    partial: t('cart.partial'),
  };
  const items = Array.isArray(cart.items) ? cart.items : [];
  const anchor = useId();
  return (
    <section id={anchor} style={{ padding: 'var(--uk-space-6) 0 var(--uk-space-4)' }}>
      <Container>
        {t('cart.title') ? <Heading level={p.site?.page.kind === 'cart' ? 1 : 2} size="lg">{t('cart.title')}</Heading> : null}
        <Notice id={`${anchor}-notice`} notice={cart.notice} messages={messages} />
        {items.length ? (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', borderTop: '1px solid var(--uk-color-line)' }}>
            {items.map((item) => <Line key={item.id} item={item} p={p} anchor={anchor} />)}
          </ul>
        ) : cart.empty && !cart.unavailable ? (
          <div style={{ display: 'grid', gap: 'var(--uk-space-4)', justifyItems: 'start' }}>
            {t('cart.empty') ? <p style={{ margin: 0, fontSize: 'var(--uk-text-md)', color: 'var(--uk-color-text-muted)' }}>{t('cart.empty')}</p> : null}
            {t('cart.continue') ? <a className="uk-button uk-button--primary" href={p.continue_href || '/products'}>{t('cart.continue')}</a> : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
