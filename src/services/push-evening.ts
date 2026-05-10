import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import { AppConfig } from '../config/index.js';
import { AiHotApiClient } from '../api/client.js';
import { getItems } from '../api/endpoints.js';
import { renderEveningDigest } from '../mail/templates/evening.js';
import { sendMail } from '../mail/sender.js';
import { upsertFetchCache } from '../db/index.js';
import { recordPush } from './push-record.js';

export async function pushEveningDigest(db: Database.Database, transporter: nodemailer.Transporter, config: AppConfig): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const since = `${today}T00:00:00Z`;

  const client = new AiHotApiClient({
    baseUrl: config.api.baseUrl,
    userAgent: config.api.userAgent,
  });

  try {
    const resp = await getItems(client, {
      mode: 'selected',
      limit: 50,
      since,
    });
    upsertFetchCache(db, `items:selected:${today}`, resp);

    const html = renderEveningDigest(today, resp.items);

    await sendMail(transporter, {
      from: config.smtp.user,
      to: config.mail.to,
      subject: `AI HOT 晚报 | ${today} · 共 ${resp.items.length} 条`,
      html,
    });

    recordPush(db, 'evening', 'success', resp.items.length);
    console.log(`[EveningPush] Success: ${today}, ${resp.items.length} items`);
  } catch (err: any) {
    recordPush(db, 'evening', 'failed', 0, err.message);
    throw err;
  }
}
