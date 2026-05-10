import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import { AppConfig } from '../config/index.js';
import { createAuthMiddleware } from './auth.js';
import { router } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(db: Database.Database, transporter: nodemailer.Transporter, config: AppConfig): express.Application {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Health check - public, no auth
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use(createAuthMiddleware(config.admin.user, config.admin.pass));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use((req, res, next) => {
    req.db = db;
    req.mailTransporter = transporter;
    req.appConfig = config;
    next();
  });

  app.use(router);

  return app;
}

declare global {
  namespace Express {
    interface Request {
      db: Database.Database;
      mailTransporter: nodemailer.Transporter;
      appConfig: AppConfig;
    }
  }
}
