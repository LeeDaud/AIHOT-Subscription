import { Router } from 'express';
import { getPushLogStats, getPushLogs, getFetchCache } from '../../db/index.js';
import { sendMail } from '../../mail/sender.js';
import { renderMorningDigest } from '../../mail/templates/morning.js';
import { renderEveningDigest } from '../../mail/templates/evening.js';
import { AiHotApiClient } from '../../api/client.js';
import { getDaily, getItems } from '../../api/endpoints.js';

export const router = Router();

// Dashboard
router.get('/', (req, res) => {
  const stats = getPushLogStats(req.db);
  res.render('dashboard', { stats });
});

// Push logs
router.get('/logs', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;
  const logs = getPushLogs(req.db, limit, offset);
  res.render('logs', { logs, page });
});

// Manual trigger - morning
router.post('/trigger/morning', async (req, res) => {
  try {
    const { pushMorningDigest } = await import('../../services/push-morning.js');
    await pushMorningDigest(req.db, req.mailTransporter, req.appConfig);
    res.json({ ok: true, message: '早报推送成功' });
  } catch (err: any) {
    res.json({ ok: false, message: err.message });
  }
});

// Manual trigger - evening
router.post('/trigger/evening', async (req, res) => {
  try {
    const { pushEveningDigest } = await import('../../services/push-evening.js');
    await pushEveningDigest(req.db, req.mailTransporter, req.appConfig);
    res.json({ ok: true, message: '晚报推送成功' });
  } catch (err: any) {
    res.json({ ok: false, message: err.message });
  }
});

// Data preview
router.get('/data/morning', (req, res) => {
  const yesterday = getDateStr(-1);
  const data = getFetchCache(req.db, `daily:${yesterday}`);
  res.render('data', { type: '早报', key: `daily:${yesterday}`, data: data ? JSON.stringify(data, null, 2) : '(无缓存)' });
});

router.get('/data/evening', (req, res) => {
  const today = getDateStr(0);
  const data = getFetchCache(req.db, `items:selected:${today}`);
  res.render('data', { type: '晚报', key: `items:selected:${today}`, data: data ? JSON.stringify(data, null, 2) : '(无缓存)' });
});

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

function getDateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
