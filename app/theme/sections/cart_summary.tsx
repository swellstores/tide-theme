import { useId } from 'react';
import type { ReactElement } from 'react';
import type { CartData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { CartNote, CartTotals, Container, CouponForm, Notice, pricesHiddenFor, SellList } from 'ui-kit';

// The cart's totals (from the cart: subtotal, discount, shipping and tax once they are known, total), its coupon (a plain
// form to apply a code, or to remove the one applied; the platform script sends it without a page load) and the
// Checkout link to the store's hosted checkout. A coupon's outcome is a notice in the store's words (Store text); the coupon
// forms name it (notice_at: an id from useId), so a no-JS answer opens at it (TD23 verification). With no
// lines (an empty cart, or one that couldn't be read) there is nothing to sum up, so nothing shows. The subtotal and the
// total are ui-kit CartAmounts, so the platform script changes them the moment a quantity changes (the optimistic cart).
// Upsell blocks sit beside the totals, and show with no lines too.
export const schema = {
  label: 'Cart summary',
  fields: [
    { id: 'cart', type: 'cart', label: 'Cart', default: 'current' },
    { id: 'show_note', type: 'select', label: 'Order note box', options: ['hide', 'show'], default: 'hide' },
    { id: 'cross_sells', type: 'product_list', label: 'Add to your order (the cart\'s cross-sells)', max: 4, default: { from: 'cart_cross_sells', limit: 4 } },
    { id: 'heading', type: 'text', label: 'Heading', retired: true },
    { id: 'subtotal_label', type: 'text', label: 'Subtotal', retired: true },
    { id: 'discount_label', type: 'text', label: 'Discount', retired: true },
    { id: 'shipping_label', type: 'text', label: 'Shipping', retired: true },
    { id: 'tax_label', type: 'text', label: 'Tax', retired: true },
    { id: 'total_label', type: 'text', label: 'Total', retired: true },
    { id: 'coupon_label', type: 'text', label: 'Coupon field label', retired: true },
    { id: 'apply_label', type: 'text', label: 'Coupon apply button', retired: true },
    { id: 'coupon_applied_label', type: 'text', label: 'Applied coupon ({code} is filled in)', retired: true },
    { id: 'remove_coupon_label', type: 'text', label: 'Coupon remove button', retired: true },
    { id: 'checkout_label', type: 'text', label: 'Checkout button', retired: true },
    { id: 'note', type: 'textarea', label: 'Note under the button' },
    { id: 'coupon_invalid_message', type: 'text', label: 'Message: the coupon wasn\'t accepted', retired: true },
    { id: 'coupon_applied_message', type: 'text', label: 'Message: the coupon was applied', retired: true },
    { id: 'coupon_removed_message', type: 'text', label: 'Message: the coupon was removed', retired: true },
  ],
  blocks: { types: ['upsell_product'], max: 3 },
} as const;

type Props = {
  t: Translate;
  cart?: CartData | null;   note?: string; cross_sells?: ProductList | null; show_note?: string; site?: SiteInfo;
  blocks?: ReactElement[];
};

export default function CartSummary(p: Props) {
  const { t } = p;
  const noticeId = `${useId()}-notice`;
  const cart = p.cart && typeof p.cart === 'object' ? p.cart : null;
  const blocks = Array.isArray(p.blocks) ? p.blocks : [];
  // the cart's cross-sells (theme-lineup §2.3, "Add to your order"), then the products typed in as blocks
  const sells = p.cross_sells?.items?.length ? (
    <div style={{ display: 'grid', gap: 'var(--uk-space-3)' }}>
      {t('cart.add_to_order') ? <h2 style={{ margin: 0, fontSize: 'var(--uk-text-sm)', fontWeight: 700, color: 'var(--uk-color-heading)' }}>{t('cart.add_to_order')}</h2> : null}
      <SellList list={p.cross_sells} pricesHidden={pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page })} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
    </div>
  ) : null;
  const upsells = sells ? (
    <div style={{ flex: '1 1 320px', minWidth: 0, display: 'grid', gap: 'var(--uk-space-5)', alignContent: 'start' }}>
      {sells}
      {blocks.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--uk-space-4)', alignItems: 'start' }}>{blocks}</div> : null}
    </div>
  ) : blocks.length ? (
    <div style={{ flex: '1 1 320px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--uk-space-4)', alignItems: 'start' }}>{blocks}</div>
  ) : null;
  if (!cart || cart.unavailable || !Array.isArray(cart.items) || !cart.items.length) {
    if (!upsells) return null;
    return (
      <section style={{ padding: '0 0 var(--uk-section-sm)' }}>
        <Container><div style={{ display: 'flex' }}>{upsells}</div></Container>
      </section>
    );
  }
  const messages = { coupon_invalid: t('cart.coupon_invalid'), coupon_applied: t('cart.coupon_applied'), coupon_removed: t('cart.coupon_removed'), note_saved: t('cart.note_saved') };
  const totals = { subtotal: t('cart.subtotal'), discount: t('cart.discount'), shipping: t('cart.shipping'), tax: t('cart.tax'), total: t('cart.total') };
  const coupon = { coupon: t('cart.coupon'), coupon_line: (code: string) => t('cart.coupon_line', { code }), remove: t('common.remove'), apply: t('common.apply') };
  return (
    <section style={{ padding: '0 0 var(--uk-section-sm)' }}>
      <Container>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 'var(--uk-space-6)' }}>
          {upsells}
          <div style={{ display: 'grid', gap: 'var(--uk-space-4)', flex: '0 1 420px', minWidth: 0 }}>
            {t('cart.summary_title') ? <h2 style={{ margin: 0, fontSize: 'var(--uk-text-lg)', fontWeight: 600, color: 'var(--uk-color-heading)' }}>{t('cart.summary_title')}</h2> : null}
            <CartTotals cart={cart} labels={totals} />
            <Notice id={noticeId} notice={cart.notice} messages={messages} />
            <CouponForm cart={cart} noticeId={noticeId} labels={coupon} />
            {p.show_note === 'show' ? <CartNote cart={cart} noticeId={noticeId} labels={{ note: t('cart.note'), save: t('cart.note_save'), hint: t('cart.note_hint') }} /> : null}
            {t('cart.checkout') ? <a className="uk-button uk-button--primary uk-button--full" href={cart.checkout_url}>{t('cart.checkout')}</a> : null}
            {p.note ? <p style={{ margin: 0, fontSize: 'var(--uk-text-xs)', color: 'var(--uk-color-text-subtle)' }}>{p.note}</p> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
