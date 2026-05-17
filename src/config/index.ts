import { SmtpConfig } from '../mail/transporter.js';

export interface AppConfig {
  smtp: SmtpConfig;
  mail: { to: string[] };
  cron: { morning: string; evening: string; timezone: string };
  api: { baseUrl: string; userAgent: string };
  admin: { port: number; user: string; pass: string };
  db: { path: string };
}

export function loadConfig(): AppConfig {
  const required = ['SMTP_USER', 'SMTP_PASS', 'MAIL_TO', 'ADMIN_PASS'];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required env: ${key}`);
  }

  return {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.qq.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE !== 'false',
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    mail: {
      to: process.env.MAIL_TO!.split(',').map(s => s.trim()),
    },
    cron: {
      morning: process.env.CRON_MORNING || '30 8 * * *',
      evening: process.env.CRON_EVENING || '0 20 * * *',
      timezone: process.env.CRON_TZ || 'Asia/Shanghai',
    },
    api: {
      baseUrl: process.env.API_BASE_URL || 'https://aihot.virxact.com',
      userAgent: process.env.API_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    },
    admin: {
      port: parseInt(process.env.ADMIN_PORT || '3456', 10),
      user: process.env.ADMIN_USER || 'admin',
      pass: process.env.ADMIN_PASS!,
    },
    db: {
      path: process.env.DB_PATH || './data/aihot-mail.db',
    },
  };
}
