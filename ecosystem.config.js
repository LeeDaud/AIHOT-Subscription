module.exports = {
  apps: [{
    name: 'aihot-mail',
    script: 'dist/index.js',
    cwd: '/opt/aihot-mail',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    max_memory_restart: '200M',
  }],
};
