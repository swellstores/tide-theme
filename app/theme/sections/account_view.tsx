import type { AccountView as Account, SiteInfo, Translate } from 'ui-kit';
import { AccountBody, AccountNav, accountHeading, Container, Heading, Notice } from 'ui-kit';

// The signed-in shopper's account (/account and its pages), every part from their account: the overview (their name
// and email), their orders a page at a time and one order (its lines, totals, shipping address, tracking codes and
// "Buy again"),
// their addresses (plain forms to add, change, delete and choose the default) and their subscriptions (one with forms
// to pause, resume or cancel it). The parts and their forms are ui-kit's (AccountNav, AccountBody and the pieces it
// uses), so a fix to them reaches every theme; this section lays them out and gives them the store's words (Store
// text). What happened (a code, never Swell's text) shows in those words too. An account Swell couldn't read shows its
// message, never an empty one.
const STATUSES = ['pending', 'draft', 'payment_pending', 'delivery_pending', 'hold', 'complete', 'canceled', 'active', 'trial', 'paused', 'pastdue', 'unpaid'];
const CODES = [
  'invalid', 'unavailable', 'rate_limited', 'session_reset', 'not_found', 'address_added', 'address_updated', 'address_deleted', 'address_default', 'subscription_paused',
  'subscription_resumed', 'subscription_canceled',
];
const ADDRESS_FIELDS = ['first_name', 'last_name', 'address1', 'address2', 'city', 'state', 'zip', 'country', 'phone'];
export const schema = {
  label: 'Account',
  fields: [
    { id: 'account', type: 'account', label: 'Account', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (and the overview link)', retired: true },
    { id: 'orders_label', type: 'text', label: 'Orders', retired: true },
    { id: 'addresses_label', type: 'text', label: 'Addresses', retired: true },
    { id: 'subscriptions_label', type: 'text', label: 'Subscriptions', retired: true },
    { id: 'sign_out_label', type: 'text', label: 'Sign-out button', retired: true },
    { id: 'order_label', type: 'text', label: 'An order ({number} is filled in)', retired: true },
    { id: 'empty_label', type: 'text', label: 'No orders, addresses or subscriptions yet', retired: true },
    { id: 'subtotal_label', type: 'text', label: 'Subtotal', retired: true },
    { id: 'discount_label', type: 'text', label: 'Discount', retired: true },
    { id: 'shipping_label', type: 'text', label: 'Shipping', retired: true },
    { id: 'tax_label', type: 'text', label: 'Tax', retired: true },
    { id: 'total_label', type: 'text', label: 'Total', retired: true },
    { id: 'shipping_address_label', type: 'text', label: 'Shipping address', retired: true },
    { id: 'tracking_label', type: 'text', label: 'Tracking', retired: true },
    { id: 'period_end_label', type: 'text', label: 'A subscription\'s current period end', retired: true },
    { id: 'default_label', type: 'text', label: 'The default address', retired: true },
    { id: 'add_address_label', type: 'text', label: 'Add an address', retired: true },
    { id: 'edit_label', type: 'text', label: 'Edit an address', retired: true },
    { id: 'save_label', type: 'text', label: 'Save an address', retired: true },
    { id: 'delete_label', type: 'text', label: 'Delete an address', retired: true },
    { id: 'make_default_label', type: 'text', label: 'Make an address the default', retired: true },
    { id: 'delete_confirm_text', type: 'text', label: 'Delete an address: the question', retired: true },
    { id: 'delete_confirm_label', type: 'text', label: 'Delete an address: the confirm button', retired: true },
    {
      id: 'address_fields', type: 'list', label: 'Address fields', max: 9, retired: true,
      item: [
        { id: 'field', type: 'select', label: 'Field', options: ADDRESS_FIELDS, default: 'address1' },
        { id: 'label', type: 'text', label: 'Shown as' },
      ],
    },
    { id: 'pause_label', type: 'text', label: 'Pause a subscription', retired: true },
    { id: 'resume_label', type: 'text', label: 'Resume a subscription', retired: true },
    { id: 'cancel_label', type: 'text', label: 'Cancel a subscription', retired: true },
    { id: 'cancel_confirm_text', type: 'text', label: 'Cancel a subscription: the question', retired: true },
    { id: 'cancel_confirm_label', type: 'text', label: 'Cancel a subscription: the confirm button', retired: true },
    { id: 'pagination_label', type: 'text', label: 'Order pages (for screen readers)', retired: true },
    { id: 'prev_label', type: 'text', label: 'Previous page link', retired: true },
    { id: 'next_label', type: 'text', label: 'Next page link', retired: true },
    { id: 'page_label', type: 'text', label: 'Page (for screen readers)', retired: true },
    { id: 'of_label', type: 'text', label: 'Of (for screen readers)', retired: true },
    {
      id: 'statuses', type: 'list', label: 'Statuses', max: 12, retired: true,
      item: [
        { id: 'status', type: 'select', label: 'Status', options: STATUSES, default: 'pending' },
        { id: 'label', type: 'text', label: 'Shown as' },
      ],
    },
    {
      id: 'messages', type: 'list', label: 'Messages', max: 12, retired: true,
      item: [
        { id: 'code', type: 'select', label: 'When', options: CODES, default: 'invalid' },
        { id: 'text', type: 'text', label: 'Message' },
      ],
    },
  ],
} as const;

type Props = { t: Translate; account?: Account | null; site?: SiteInfo };

export default function AccountView(p: Props) {
  const { t } = p;
  const account = p.account && typeof p.account === 'object' ? p.account : null;
  if (!account) return null;
  const messages = {
    invalid: t('account.message_invalid'), unavailable: t('account.message_unavailable'), rate_limited: t('errors.rate_limited'),
    session_reset: t('account.message_session_reset'), not_found: t('account.message_not_found'), address_added: t('account.message_address_added'),
    address_updated: t('account.message_address_updated'), address_deleted: t('account.message_address_deleted'), address_default: t('account.message_address_default'),
    subscription_paused: t('account.message_subscription_paused'), subscription_resumed: t('account.message_subscription_resumed'),
    subscription_canceled: t('account.message_subscription_canceled'),
  };
  const labels = {
    title: t('account.title'), orders: t('account.orders'), addresses: t('account.addresses'), subscriptions: t('account.subscriptions'), sign_out: t('account.sign_out'),
    empty: t('account.empty'), order: (number: string) => t('account.order', { number }), status: (s: string) => t(`order_status.${s}`),
    subtotal: t('cart.subtotal'), discount: t('cart.discount'), shipping: t('cart.shipping'), tax: t('cart.tax'), total: t('cart.total'),
    shipping_address: t('account.shipping_address'), tracking: t('account.tracking'), period_end: t('account.period_end'), buy_again: t('account.buy_again'),
    default_address: t('account.default_address'), make_default: t('account.make_default'), edit: t('common.edit'), save: t('common.save'), delete: t('common.delete'),
    delete_confirm: t('account.delete_confirm'), delete_yes: t('account.delete_yes'), add_address: t('account.add_address'),
    // (a label of white space only is none: the English name, as the publish review counts it)
    fields: {
      first_name: t('address.first_name'), last_name: t('address.last_name'), address1: t('address.address1'), address2: t('address.address2'), city: t('address.city'),
      state: t('address.state'), zip: t('address.zip'), country: t('address.country'), phone: t('common.phone'),
    },
    pause: t('account.pause'), resume: t('account.resume'), cancel: t('account.cancel'), cancel_yes: t('account.cancel_yes'), cancel_confirm: t('account.cancel_confirm'),
    previous: t('pagination.previous'), next: t('pagination.next'), pagination: t('pagination.label'), page: t('pagination.page'), of: t('pagination.of'),
  };
  const heading = accountHeading(account, labels);
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-section-sm)' }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(160px, 220px) minmax(0, 1fr)', gap: 'var(--uk-space-7)', alignItems: 'start' }}>
          <AccountNav account={account} labels={labels} />
          <div style={{ minWidth: 0 }}>
            {heading ? <Heading level={1} size="lg">{heading}</Heading> : null}
            <Notice notice={account.notice} messages={messages} />
            <AccountBody account={account} labels={labels} site={p.site} />
          </div>
        </div>
      </Container>
    </section>
  );
}
