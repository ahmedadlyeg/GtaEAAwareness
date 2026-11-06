# Deploying the GTA EA Awareness Hub to a Hostinger VPS

Target: Hostinger VPS (Ubuntu, KVM 2) · IP `187.126.123.86` · host `srv2051748.hstgr.cloud`
Stack: Node.js + SQLite, single process serving SPA + API, nginx reverse proxy, HTTPS via Let's Encrypt.

**Before you start, replace these placeholders everywhere they appear:**
- `YOUR_DOMAIN` → your real hostname, e.g. `hub.example.com`
- `YOUR_GH_USER/YOUR_REPO` → your GitHub repo
- Hostinger mailbox + password for SMTP

---

## 0. Push the code to GitHub (from your Windows machine)

The repo is already initialized locally (`.gitignore` excludes `.env`, `data/`, `*.db`).
Create an **empty** repo on github.com (no README), then:

```bash
git remote add origin https://github.com/YOUR_GH_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

> `node_modules`, `.env`, and the database are **not** pushed — that's intentional.

---

## 1. Connect and prepare the server

```bash
ssh root@187.126.123.86
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git nginx sqlite3
npm install -g pm2
node -v    # expect v22.x
```

Create a non-root user to run the app:

```bash
adduser --disabled-password --gecos "" eahub
usermod -aG sudo eahub
```

## 2. Get the app and install deps

```bash
sudo -iu eahub                                   # become the app user
git clone https://github.com/YOUR_GH_USER/YOUR_REPO.git ~/app
cd ~/app/server
npm ci --omit=dev
```

## 3. Configure the environment

```bash
cp .env.production.example .env
nano .env
```
Fill in:
- `JWT_SECRET` and `OTP_PEPPER` — run `openssl rand -base64 48` for each
- `ADMIN_EMAILS` — your address (gets the dashboard)
- `APP_BASE_URL=https://YOUR_DOMAIN`
- `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` — your Hostinger mailbox
  (create it in hPanel → Emails; host `smtp.hostinger.com`, port `465`, SSL)

## 4. Point the SPA at the live database

Edit `~/app/js/config.js` and set:
```js
apiMode: "rest",
```
(Everything else there can stay. This is what makes the browser read/write the DB instead of localStorage.)

## 5. Initialize the database

```bash
cd ~/app/server
npm run sync:content      # loads modules, questions, answer keys, sign-off statement
# optional sample data for a demo dashboard:
# npm run seed:demo
```
The SQLite file is created at `server/data/ea-hub.db`.

## 6. Run under PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd        # run the sudo command it prints, so it survives reboots
pm2 logs ea-hub            # watch startup; Ctrl+C to exit
```
The app now listens on `127.0.0.1:8080`.

## 7. nginx reverse proxy

```bash
sudo cp ~/app/deploy/nginx/ea-hub.conf /etc/nginx/sites-available/ea-hub
sudo sed -i 's/YOUR_DOMAIN/hub.example.com/' /etc/nginx/sites-available/ea-hub   # <- your domain
sudo ln -s /etc/nginx/sites-available/ea-hub /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 8. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 9. DNS + HTTPS

1. In your domain's DNS, add an **A record**: `hub` (or `@`) → `187.126.123.86`.
2. Wait for it to resolve (`ping YOUR_DOMAIN`), then:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN
```
Certbot installs the certificate, adds the `:443` server block, and sets up auto-renewal.

## 10. Verify

```bash
curl https://YOUR_DOMAIN/api/v1/health      # {"status":"ok","db":"sqlite",...}
```
Open `https://YOUR_DOMAIN`, click **Create account** with an allowed-domain email,
read the one-time code from your inbox (or `pm2 logs ea-hub` if SMTP isn't set yet),
choose a password, and confirm the dashboard loads for your `ADMIN_EMAILS` address.

---

## Updating later

```bash
sudo -iu eahub
cd ~/app
git pull
cd server && npm ci --omit=dev && npm run sync:content
pm2 restart ea-hub
```

## Backups

```bash
mkdir -p ~/backups
chmod +x ~/app/deploy/backup-db.sh
crontab -e
# add:
0 2 * * *  /home/eahub/app/deploy/backup-db.sh >> /home/eahub/backups/backup.log 2>&1
```

## Troubleshooting

| Symptom | Check |
|---|---|
| 502 Bad Gateway | `pm2 status` / `pm2 logs ea-hub` — is Node running on :8080? |
| No sign-up emails | `.env` SMTP values; `pm2 logs ea-hub` shows `dev-mail` if SMTP_HOST is empty |
| 403 on dashboard | Your email must be in `ADMIN_EMAILS` **before** first sign-in |
| Can't sign in | `ALLOWED_EMAIL_DOMAINS` must include your email's domain |
| DB changes lost on redeploy | Never delete `server/data/`; it's gitignored and lives on the VPS only |

See `../server/README.md` for the full production notes (SQL Server option, SMTP, security, retention).
