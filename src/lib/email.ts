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
