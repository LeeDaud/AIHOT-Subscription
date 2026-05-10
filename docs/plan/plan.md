# AI HOT 邮件推送服务 — 架构规划

## 项目简介

从 aihot.virxact.com 的公开 REST API 拉取 AI 资讯，通过 SMTP 邮件推送到指定邮箱。单用户自用，部署在已有 VPS。

## 需求

- **数据源**: AI HOT 公开 API（免 token，需浏览器 UA）
- **技术栈**: Node.js / TypeScript
- **推送策略**: 早报 08:30（昨日日报）+ 晚报 20:00（当日精选）
- **邮件方式**: SMTP 直连 QQ 邮箱
- **管理后台**: Express + EJS，HTTP Basic Auth 保护，单用户
- **部署**: VPS (66.63.173.143)，pm2 进程管理，nginx 反代

## 目录结构

```
021-AIHOT/
├── package.json / tsconfig.json / .env / ecosystem.config.js
├── src/
│   ├── index.ts                    # 入口
│   ├── config/
│   │   └── index.ts                # 配置加载
│   ├── api/                        # API 客户端
│   │   ├── types.ts
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── mail/                       # 邮件模块
│   │   ├── transporter.ts
│   │   ├── sender.ts
│   │   └── templates/
│   │       ├── morning.ts
│   │       └── evening.ts
│   ├── scheduler/
│   │   └── index.ts
│   ├── db/
│   │   └── index.ts
│   ├── web/                        # 管理后台
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── routes/
│   │   └── views/
│   └── services/
│       ├── push-morning.ts
│       ├── push-evening.ts
│       └── push-record.ts
├── data/
└── deploy/
    ├── nginx/
    └── setup.sh
```

## 实现阶段

| # | 模块 | 产出 |
|---|------|------|
| 1 | 项目初始化 | package.json, tsconfig, 入口骨架 |
| 2 | API 客户端 | types, client, endpoints |
| 3 | 配置 + 数据库 | config loader, SQLite CRUD |
| 4 | 邮件模板 + 发送 | transporter, sender, 模板 |
| 5 | 调度 | cron 注册 |
| 6 | 推送业务服务 | push-morning, push-evening, push-record |
| 7 | 管理后台 | Express app, EJS, 认证 |
| 8 | 部署上线 | pm2, nginx, 部署脚本 |
