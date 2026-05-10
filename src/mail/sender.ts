import nodemailer from 'nodemailer';

export interface SendMailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendMail(transporter: nodemailer.Transporter, opts: SendMailOptions): Promise<void> {
  await transporter.sendMail(opts);
  const recipients = Array.isArray(opts.to) ? opts.to.join(', ') : opts.to;
  console.log(`[Mail] Sent "${opts.subject}" to ${recipients}`);
}
