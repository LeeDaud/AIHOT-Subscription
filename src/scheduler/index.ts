import Database from 'better-sqlite3';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { AppConfig } from '../config/index.js';

export function startScheduler(db: Database.Database, transporter: nodemailer.Transporter, config: AppConfig): void {
  cron.schedule(config.cron.morning, async () => {
    console.log(`[Scheduler] Morning push at ${new Date().toISOString()}`);
    const { pushMorningDigest } = await import('../services/push-morning.js');
    try {
      await pushMorningDigest(db, transporter, config);
    } catch (err) {
      console.error('[Scheduler] Morning push failed:', err);
    }
  });

  cron.schedule(config.cron.evening, async () => {
    console.log(`[Scheduler] Evening push at ${new Date().toISOString()}`);
    const { pushEveningDigest } = await import('../services/push-evening.js');
    try {
      await pushEveningDigest(db, transporter, config);
    } catch (err) {
      console.error('[Scheduler] Evening push failed:', err);
    }
  });
}
