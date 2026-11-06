// PM2 process definition for the EA Awareness Hub.
// Run from the server/ folder:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup systemd     # then run the command it prints (with sudo)
//
// Single instance on purpose: SQLite is a single-writer file DB, and the
// per-IP rate limiter uses in-memory counters. One process is the right fit
// for a single VPS. (Scaling out would mean SQL Server + a shared rate store.)
module.exports = {
  apps: [
    {
      name: 'ea-hub',
      script: 'src/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '400M',
      // Logs (pm2 writes to ~/.pm2/logs by default; override here if you like)
      time: true,
    },
  ],
};
