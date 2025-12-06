# SPK ARAS - Kelompok 2

Sistem Pendukung Keputusan menggunakan Metode ARAS (Additive Ratio Assessment) dengan Laravel 11 + React TypeScript.

## 🚀 Features

- **Admin Panel**
  - Manajemen Kriteria (CRUD)
  - Auto-generate kode kriteria
  - Validasi total bobot 100%

- **User Panel**
  - Kalkulasi ARAS dengan step-by-step process
  - Save & View History kalkulasi
  - Responsive design

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.2)
- **Frontend**: React 19 + TypeScript
- **Database**: MySQL
- **Styling**: Tailwind CSS + Neobrutalism Theme
- **Build**: Vite

## 📋 Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

## 🔧 Installation

### Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd sistem-pendukung-keputusan

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
# Create database: spk_aras
php artisan migrate --seed

# Build assets
npm run build

# Run development server
php artisan serve
npm run dev
```

### Production Deployment (Railway)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for production"
git push
```

2. **Setup Railway**
   - Login to [Railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Add MySQL database service

3. **Set Environment Variables**
```env
APP_KEY=base64:... (generate with: php artisan key:generate --show)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.up.railway.app
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

4. **Deploy** - Railway will auto-deploy

## 👥 Default Users

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**User:**
- Email: `user@example.com`
- Password: `password`

## 📱 Screenshots

(Add your screenshots here)

## 📄 License

MIT License

## 👨‍💻 Kelompok 2

- Member 1
- Member 2
- Member 3
