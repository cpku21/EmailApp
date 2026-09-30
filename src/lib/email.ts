import nodemailer, { type Transporter } from 'nodemailer';

import { getEmailEnv, type EmailEnv } from '@/lib/env';

const globalWithEmail = globalThis as typeof globalThis & {
  emailTransporter?: Transporter;
};

function getEmailTransporter(env: EmailEnv): Transporter {
  globalWithEmail.emailTransporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  return globalWithEmail.emailTransporter;
}

export async function sendEmailVerification(
  email: string,
  token: string,
): Promise<void> {
  const env = getEmailEnv();
  const verificationUrl = new URL('/verify-email', env.APP_URL);
  verificationUrl.searchParams.set('token', token);
  const link = verificationUrl.toString();

  await getEmailTransporter(env).sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Verify your EmailApp account',
    text: [
      'Verify your EmailApp account by opening this link:',
      link,
      '',
      'This link expires in 24 hours.',
      'If you did not create this account, you can ignore this email.',
    ].join('\n'),
    html: `
      <h1>Verify your EmailApp account</h1>
      <p>Confirm your email address to access company contacts.</p>
      <p><a href="${link}">Verify email address</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create this account, you can ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const env = getEmailEnv();
  const resetUrl = new URL('/reset-password', env.APP_URL);
  resetUrl.searchParams.set('token', token);
  const link = resetUrl.toString();

  // Reset links are short-lived and delivered only to the account email address.
  await getEmailTransporter(env).sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Reset your EmailApp password',
    text: [
      'Reset your EmailApp password by opening this link:',
      link,
      '',
      'This link expires in 1 hour.',
      'If you did not request a password reset, you can ignore this email.',
    ].join('\n'),
    html: `
      <h1>Reset your EmailApp password</h1>
      <p>Use the link below to choose a new password.</p>
      <p><a href="${link}">Reset password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `,
  });
}
