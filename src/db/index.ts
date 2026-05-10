import Database from 'better-sqlite3';

export interface PushLogRow {
  id?: number;
  push_type: 'morning' | 'evening';
  push_date: string;
  status: 'success' | 'failed';
  item_count: number;
  error_message: string | null;
  pushed_at?: string;
}

export interface FetchCacheRow {
  id?: number;
  cache_key: string;
  data: string;
  fetched_at?: string;
}

export function initDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS push_logs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      push_type     TEXT NOT NULL,
      push_date     TEXT NOT NULL,
      status        TEXT NOT NULL,
      item_count    INTEGER DEFAULT 0,
      error_message TEXT,
      pushed_at     TEXT NOT NULL DEFAULT (datetime('now', '+8 hours'))
    );

    CREATE TABLE IF NOT EXISTS fetch_cache (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      cache_key     TEXT NOT NULL UNIQUE,
      data          TEXT NOT NULL,
      fetched_at    TEXT NOT NULL DEFAULT (datetime('now', '+8 hours'))
    );

    CREATE TABLE IF NOT EXISTS _schema_version (
      version INTEGER NOT NULL
    );
  `);

  // Migration: fix invalid DEFAULT syntax '+8:00' -> '+8 hours'
  const ver = db.prepare('SELECT MAX(version) as v FROM _schema_version').get() as { v: number | null } | undefined;
  if (!ver || ver.v === null || ver.v < 1) {
    db.exec(`
      DROP TABLE IF EXISTS push_logs_old;
      ALTER TABLE push_logs RENAME TO push_logs_old;
      CREATE TABLE push_logs (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        push_type     TEXT NOT NULL,
        push_date     TEXT NOT NULL,
        status        TEXT NOT NULL,
        item_count    INTEGER DEFAULT 0,
        error_message TEXT,
        pushed_at     TEXT NOT NULL DEFAULT (datetime('now', '+8 hours'))
      );
      INSERT INTO push_logs SELECT * FROM push_logs_old;
      DROP TABLE push_logs_old;

      DROP TABLE IF EXISTS fetch_cache_old;
      ALTER TABLE fetch_cache RENAME TO fetch_cache_old;
      CREATE TABLE fetch_cache (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        cache_key     TEXT NOT NULL UNIQUE,
        data          TEXT NOT NULL,
        fetched_at    TEXT NOT NULL DEFAULT (datetime('now', '+8 hours'))
      );
      INSERT INTO fetch_cache SELECT * FROM fetch_cache_old;
      DROP TABLE fetch_cache_old;

      INSERT INTO _schema_version (version) VALUES (1);
    `);
  }

  return db;
}

export function insertPushLog(db: Database.Database, log: Omit<PushLogRow, 'id' | 'pushed_at'>): void {
  const stmt = db.prepare(`
    INSERT INTO push_logs (push_type, push_date, status, item_count, error_message)
    VALUES (@push_type, @push_date, @status, @item_count, @error_message)
  `);
  stmt.run(log);
}

export function getPushLogs(db: Database.Database, limit = 20, offset = 0): PushLogRow[] {
  const stmt = db.prepare('SELECT * FROM push_logs ORDER BY pushed_at DESC LIMIT ? OFFSET ?');
  return stmt.all(limit, offset) as PushLogRow[];
}

export function getPushLogStats(db: Database.Database): { total: number; success: number; failed: number; lastPush: string | null } {
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status='success' THEN 1 ELSE 0 END) as success,
      SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) as failed,
      MAX(pushed_at) as lastPush
    FROM push_logs
  `).get() as any;
  return { total: row.total, success: row.success, failed: row.failed, lastPush: row.lastPush };
}

export function upsertFetchCache(db: Database.Database, key: string, data: object): void {
  const stmt = db.prepare(`
    INSERT INTO fetch_cache (cache_key, data) VALUES (?, ?)
    ON CONFLICT(cache_key) DO UPDATE SET data = excluded.data, fetched_at = datetime('now', '+8 hours')
  `);
  stmt.run(key, JSON.stringify(data));
}

export function getFetchCache(db: Database.Database, key: string): object | null {
  const row = db.prepare('SELECT data FROM fetch_cache WHERE cache_key = ?').get(key) as FetchCacheRow | undefined;
  return row ? JSON.parse(row.data) : null;
}
