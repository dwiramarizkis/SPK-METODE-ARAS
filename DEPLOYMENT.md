# 🚀 Deployment Guide - Railway with MySQL

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Project sudah di push ke GitHub

## Step 1: Setup Railway Project

1. Login ke https://railway.app
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository **sistem-pendukung-keputusan**
5. Railway akan otomatis detect Laravel dan mulai deploy

## Step 2: Tambah MySQL Database

1. Di dashboard project Railway, klik **"+ New"**
2. Pilih **"Database"**
3. Pilih **"Add MySQL"**
4. Tunggu MySQL container selesai deploy (biasanya 1-2 menit)

## Step 3: Configure Environment Variables

1. Klik service **Laravel app** (bukan MySQL)
2. Masuk ke tab **"Variables"**
3. Klik **"+ New Variable"** atau **"Raw Editor"**
4. Tambahkan variables berikut:

```env
# App Configuration
APP_NAME="SPK ARAS"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:ydF+zfztLsYaJ6Ss/uxv9NfBOiGpFgockVAsoPq0iNk=
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Database - MySQL
DB_CONNECTION=mysql

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
```

**PENTING**: 
- Railway akan **otomatis inject** MySQL credentials (`MYSQLHOST`, `MYSQLPORT`, dll)
- Jangan manual set `DB_HOST`, `DB_PORT`, dll - biarkan Railway handle
- `APP_KEY` harus sama dengan yang di local (atau generate baru dengan `php artisan key:generate --show`)

## Step 4: Generate Domain & Redeploy

1. Di service Laravel app, tab **"Settings"**
2. Scroll ke **"Networking"**
3. Klik **"Generate Domain"**
4. Copy domain yang di-generate (contoh: `spk-aras-production.up.railway.app`)
5. Update `APP_URL` di Variables dengan domain tersebut
6. Klik **"Deploy"** untuk redeploy

## Step 5: Verify Deployment

1. Buka tab **"Deployments"**
2. Klik deployment terbaru
3. Lihat **"View Logs"**
4. Pastikan ada log sukses:
   ```
   ✓ Configuration cache cleared successfully
   ✓ Running migrations
   ✓ Seeding: UserSeeder
   ✓ Seeding: KriteriaSeeder
   ✓ Laravel development server started
   ```

5. Buka domain Railway kamu
6. Login dengan:
   - **Admin**: `admin@example.com` / `password`
   - **User**: `user@example.com` / `password`

## Troubleshooting

### ❌ Error: "Connection refused"
- Pastikan MySQL service sudah running (cek di dashboard)
- Pastikan `DB_CONNECTION=mysql` sudah di-set
- Restart service Laravel app

### ❌ Error: "No application encryption key"
- Generate key: `php artisan key:generate --show`
- Copy output dan set ke `APP_KEY` di Railway Variables

### ❌ Error: "SQLSTATE[HY000] [2002]"
- MySQL belum ready, tunggu 1-2 menit
- Atau MySQL service crash, restart MySQL service

### ❌ Error: "Class not found"
- Clear cache: Tambah command di start script
- Atau redeploy ulang

### 🔍 Check MySQL Connection
Di Railway, buka MySQL service > **"Connect"** tab untuk lihat credentials.

## Update Code

Setiap kali update code:

```bash
git add .
git commit -m "Your commit message"
git push
```

Railway akan **otomatis redeploy** setiap ada push ke GitHub.

## Database Management

### Access MySQL via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Connect to MySQL
railway connect MySQL
```

### Run Migration Manual

```bash
railway run php artisan migrate
```

### Reset Database

```bash
railway run php artisan migrate:fresh --seed
```

## Cost Estimation

Railway Free Tier:
- $5 credit per month
- Cukup untuk development/demo
- Upgrade ke Pro ($20/month) untuk production

## Security Checklist

- ✅ `APP_DEBUG=false` di production
- ✅ `APP_ENV=production`
- ✅ Generate unique `APP_KEY`
- ✅ Jangan commit `.env` ke GitHub
- ✅ Gunakan strong password untuk admin

## Support

Jika ada masalah:
1. Check Railway logs
2. Check GitHub Actions (jika ada)
3. Buka issue di repository

---

**Happy Deploying! 🎉**
