import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import { AppConfig } from '../config/index.js';
import { AiHotApiClient } from '../api/client.js';
import { getDaily } from '../api/endpoints.js';
import { renderMorningDigest } from '../mail/templates/morning.js';
import { sendMail } from '../mail/sender.js';
import { upsertFetchCache } from '../db/index.js';
import { recordPush } from './push-record.js';

export async function pushMorningDigest(db: Database.Database, transporter: nodemailer.Transporter, config: AppConfig): Promise<void> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  const client = new AiHotApiClient({
    baseUrl: config.api.baseUrl,
    userAgent: config.api.userAgent,
  });

  try {
    const daily = await getDaily(client, dateStr);
    upsertFetchCache(db, `daily:${dateStr}`, daily);

    const html = renderMorningDigest(
      dateStr,
      daily.sections || [],
      daily.flashes || [],
    );

    await sendMail(transporter, {
      from: config.smtp.user,
      to: config.mail.to,
      subject: `AI HOT 早报 | ${dateStr}`,
      html,
    });

    const itemCount = (daily.sections || []).reduce((sum, s) => sum + s.items.length, 0);
    recordPush(db, 'morning', 'success', itemCount);
    console.log(`[MorningPush] Success: ${dateStr}, ${itemCount} items`);
  } catch (err: any) {
    recordPush(db, 'morning', 'failed', 0, err.message);
    throw err;
  }
}
