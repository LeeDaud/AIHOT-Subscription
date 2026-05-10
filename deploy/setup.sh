#!/bin/bash
set -e

APP_DIR=/opt/aihot-mail
DOMAIN=mail-aihot.licheng.website

echo "=== AIHOT Mail 首次部署 ==="

# 1. 安装 Node.js
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

# 2. 安装 pm2
npm install -g pm2

# 3. 创建目录
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# 4. 复制文件（手动 scp 或 git clone）
if [ ! -f package.json ]; then
  echo "请先在本地打包并传输到 $APP_DIR"
  echo "  cd D:\\AAA-Project\\021-AIHOT"
  echo "  tar czf /tmp/aihot-mail.tar.gz --exclude node_modules --exclude .git ."
  echo "  scp /tmp/aihot-mail.tar.gz root@YOUR_SERVER:$APP_DIR/"
  echo "  ssh root@YOUR_SERVER 'cd $APP_DIR && tar xzf aihot-mail.tar.gz && npm install --production'"
  exit 1
fi

# 5. 安装依赖
npm install --production

# 6. 创建 .env（手动创建）
if [ ! -f .env ]; then
  echo "创建 .env 文件..."
  cat > .env << 'ENVEOF'
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@qq.com
SMTP_PASS=your_smtp_authorization_code
MAIL_TO=your_email@qq.com
CRON_MORNING=30 8 * * *
CRON_EVENING=0 20 * * *
API_BASE_URL=https://aihot.virxact.com
API_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36
ADMIN_PORT=3456
ADMIN_USER=admin
ADMIN_PASS=
DB_PATH=./data/aihot-mail.db
ENVEOF
  echo "请编辑 .env 填写 SMTP 和 ADMIN_PASS"
  exit 1
fi

# 7. 创建数据目录
mkdir -p data logs

# 8. 启动
pm2 startOrRestart ecosystem.config.js
pm2 save

# 9. 配置 nginx
if command -v nginx &>/dev/null && [ ! -f "/etc/nginx/sites-enabled/$DOMAIN.conf" ]; then
  cp deploy/nginx/aihot-mail.conf "/etc/nginx/sites-available/$DOMAIN.conf"
  sed -i "s/server_name .*/server_name $DOMAIN;/" "/etc/nginx/sites-available/$DOMAIN.conf"
  ln -sf "/etc/nginx/sites-available/$DOMAIN.conf" "/etc/nginx/sites-enabled/"
  nginx -t && systemctl reload nginx
  echo "Nginx 已配置"
fi

echo "=== 部署完成 ==="
echo "管理后台: http://$DOMAIN"
echo "健康检查: http://127.0.0.1:3456/health"
