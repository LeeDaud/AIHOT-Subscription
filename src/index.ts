import 'dotenv/config';
import { loadConfig } from './config/index.js';
import { initDatabase } from './db/index.js';
import { createTransporter } from './mail/transporter.js';
import { startScheduler } from './scheduler/index.js';
import { createApp } from './web/index.js';

async function main() {
  const config = loadConfig();
  const db = initDatabase(config.db.path);
  const transporter = createTransporter(config.smtp);

  startScheduler(db, transporter, config);
  console.log(`[Scheduler] Started: morning=${config.cron.morning}, evening=${config.cron.evening}`);

  const app = createApp(db, transporter, config);
  app.listen(config.admin.port, () => {
    console.log(`[Admin] Web server running on http://0.0.0.0:${config.admin.port}`);
  });

  console.log('[Main] AIHOT Mail service started');
}

main().catch((err) => {
  console.error('[Main] Fatal error:', err);
  process.exit(1);
});
