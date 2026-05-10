# AI HOT 邮件推送 — 任务清单

## 阶段 1: 项目初始化

- [ ] 创建 package.json（依赖：express, ejs, nodemailer, better-sqlite3, node-cron, express-basic-auth, dotenv）
- [ ] 创建 tsconfig.json
- [ ] 创建 .env / .env.example / .gitignore
- [ ] 创建 src/index.ts 入口骨架

## 阶段 2: API 客户端

- [ ] src/api/types.ts — API 响应类型定义
- [ ] src/api/client.ts — HTTP 客户端封装
- [ ] src/api/endpoints.ts — 各端点方法

## 阶段 3: 配置 + 数据库

- [ ] src/config/index.ts — 配置加载 + 校验
- [ ] src/db/index.ts — SQLite 建表 + CRUD

## 阶段 4: 邮件模板 + 发送

- [ ] src/mail/transporter.ts — SMTP 连接
- [ ] src/mail/sender.ts — 发送封装
- [ ] src/mail/templates/morning.ts — 早报 HTML 模板
- [ ] src/mail/templates/evening.ts — 晚报 HTML 模板

## 阶段 5: 调度

- [ ] src/scheduler/index.ts — cron 任务注册

## 阶段 6: 推送业务服务

- [ ] src/services/push-morning.ts
- [ ] src/services/push-evening.ts
- [ ] src/services/push-record.ts

## 阶段 7: 管理后台

- [ ] src/web/auth.ts — Basic Auth 中间件
- [ ] src/web/routes/ — 路由处理
- [ ] src/web/views/ — EJS 模板
- [ ] src/web/index.ts — Express app 创建

## 阶段 8: 部署上线

- [ ] deploy/nginx/ — Nginx 配置
- [ ] deploy/setup.sh — 部署脚本
- [ ] ecosystem.config.js — pm2 配置
