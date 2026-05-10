import Database from 'better-sqlite3';
import { insertPushLog } from '../db/index.js';

export function recordPush(
  db: Database.Database,
  type: 'morning' | 'evening',
  status: 'success' | 'failed',
  itemCount: number,
  errorMessage?: string,
): void {
  const date = new Date().toISOString().slice(0, 10);
  insertPushLog(db, {
    push_type: type,
    push_date: date,
    status,
    item_count: itemCount,
    error_message: errorMessage || null,
  });
}
