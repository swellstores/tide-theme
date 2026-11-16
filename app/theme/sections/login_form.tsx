import type { AuthView, Translate } from 'ui-kit';
import { AuthForms, authHeading, Container, Heading, Notice } from 'ui-kit';

// The sign-in page's forms (/account/login, /signup, /recover and a reset link), plain forms that work without
// scripts: sign in, create an account (with the email sign-up choice when the store takes it), ask for a reset link and
// choose a new password. The forms are ui-kit's (AuthForms, SignInForm, SignUpForm), so a fix to them reaches every
// theme; this section lays them out. The view and what happened come from the page (a code, never Swell's text), shown
// in the store's words (Store text). A store whose accounts are off shows only its message.
export const schema = {
  label: 'Sign-in form',
  fields: [
    { id: 'auth', type: 'auth', label: 'Sign-in form', default: 'current' },
    { id: 'login_heading', type: 'text', label: 'Sign-in heading', retired: true },
    { id: 'signup_heading', type: 'text', label: 'Sign-up heading', retired: true },
    { id: 'recover_heading', type: 'text', label: 'Password reset heading', retired: true },
    { id: 'reset_heading', type: 'text', label: 'New password heading', retired: true },
    { id: 'recover_intro', type: 'textarea', label: 'Password reset text', retired: true },
    { id: 'email_label', type: 'text', label: 'Email field', retired: true },
    { id: 'password_label', type: 'text', label: 'Password field', retired: true },
    { id: 'new_password_label', type: 'text', label: 'New password field', retired: true },
    { id: 'password_hint', type: 'text', label: 'New password hint', retired: true },
    { id: 'first_name_label', type: 'text', label: 'First name field', retired: true },
    { id: 'last_name_label', type: 'text', label: 'Last name field', retired: true },
    { id: 'optin_label', type: 'text', label: 'Email sign-up choice', retired: true },
    { id: 'login_button', type: 'text', label: 'Sign-in button', retired: true },
    { id: 'signup_button', type: 'text', label: 'Sign-up button', retired: true },
    { id: 'recover_button', type: 'text', label: 'Reset link button', retired: true },
    { id: 'reset_button', type: 'text', label: 'New password button', retired: true },
    { id: 'signup_link', type: 'text', label: 'Link to sign up', retired: true },
    { id: 'recover_link', type: 'text', label: 'Link to reset a password', retired: true },
    { id: 'login_link', type: 'text', label: 'Link back to sign in', retired: true },
    { id: 'disabled_message', type: 'text', label: 'Message: accounts are off', retired: true },
    { id: 'login_failed_message', type: 'text', label: 'Message: wrong email or password', retired: true },
    { id: 'email_taken_message', type: 'text', label: 'Message: the email has an account', retired: true },
    { id: 'reset_failed_message', type: 'text', label: 'Message: the reset link doesn\'t work', retired: true },
    { id: 'sent_message', type: 'text', label: 'Message: the reset link was sent', retired: true },
    { id: 'reset_done_message', type: 'text', label: 'Message: the password was changed', retired: true },
    { id: 'invalid_message', type: 'text', label: 'Message: the form wasn\'t accepted', retired: true },
    { id: 'unavailable_message', type: 'text', label: 'Message: sign-in isn\'t working', retired: true },
    { id: 'rate_limited_message', type: 'text', label: 'Message: too many tries', retired: true },
    { id: 'session_reset_message', type: 'text', label: 'Message: the session was reset', retired: true },
  ],
} as const;

type Props = {
  t: Translate;
  auth?: AuthView | null;           };

export default function LoginForm(p: Props) {
  const { t } = p;
  const auth = p.auth && typeof p.auth === 'object' ? p.auth : null;
  if (!auth) return null;
  const messages = {
    login_failed: t('login.failed'), email_taken: t('login.email_taken'), reset_failed: t('login.reset_failed'), sent: t('login.reset_sent'),
    reset_done: t('login.reset_done'), invalid: t('login.check_form'), unavailable: t('errors.try_again'), rate_limited: t('errors.rate_limited'),
    session_reset: t('errors.session_reset'),
  };
  const labels = {
    sign_in: t('login.sign_in'), create_title: t('login.create_title'), reset_title: t('login.reset_title'), new_password_title: t('login.new_password_title'),
    email: t('common.email'), password: t('login.password'), password_hint: t('login.password_hint'), first_name: t('address.first_name'), last_name: t('address.last_name'),
    optin: t('login.optin'), create: t('login.create'), reset_intro: t('login.reset_intro'), send_reset: t('login.send_reset'), new_password: t('login.new_password'),
    save_password: t('login.save_password'), forgot: t('login.forgot'), back: t('login.back'), disabled: t('login.disabled'),
  };
  const heading = authHeading(auth, labels);
  return (
    <section style={{ padding: 'var(--uk-section-sm) 0' }}>
      <Container width="narrow">
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          {heading ? <Heading level={1} size="lg">{heading}</Heading> : null}
          {auth.accounts === 'disabled' ? null : <Notice notice={auth.notice} messages={messages} />}
          <AuthForms auth={auth} labels={labels} />
        </div>
      </Container>
    </section>
  );
}
