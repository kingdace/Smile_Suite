# 🔄 Using MySQL on Render (Alternative to PostgreSQL)

Render's free tier defaults to **PostgreSQL**, but your app uses **MySQL/MariaDB**. Here are your options:

## Option 1: Use External MySQL Service (Recommended)

Keep using MySQL by connecting to an external service:

### A. Use Railway MySQL (Free Tier)

1. On Railway, create a **MySQL** service
2. Get connection details:
   - Host, Port, Database, Username, Password
3. In Render, add these as environment variables:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=your-railway-mysql-host.railway.app
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

### B. Use PlanetScale (Free MySQL)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a database
3. Get connection string
4. Add to Render environment variables

### C. Use Aiven MySQL (Free Tier)

1. Sign up at [aiven.io](https://aiven.io)
2. Create MySQL service
3. Get connection details
4. Add to Render

---

## Option 2: Switch to PostgreSQL (Easier for Render)

PostgreSQL is well-supported on Render's free tier. To switch:

### Step 1: Update Database Connection

In Render environment variables, change:
```env
DB_CONNECTION=pgsql
```

### Step 2: Update Laravel Migrations (if needed)

Most Laravel migrations work with both MySQL and PostgreSQL. If you have MySQL-specific syntax, you may need to update:

- `DB::raw()` statements
- Date functions
- JSON column operations

### Step 3: Run Migrations

```bash
php artisan migrate:fresh
```

### Step 4: Re-seed Data

```bash
php artisan db:seed
```

---

## Option 3: Use Render MySQL (Paid Plan)

Render offers MySQL on paid plans:

1. Upgrade Render plan
2. Create MySQL database in Render
3. Link to your services

---

## 🎯 Recommendation

**For quick deployment**: Use **Option 1A (Railway MySQL)** - You already have Railway account, just create a MySQL service there and connect Render to it.

**For long-term**: Consider **Option 2 (PostgreSQL)** - It's free on Render and works great with Laravel.

---

## 📝 Quick Setup: Railway MySQL + Render

1. **On Railway**:
   - Create new service → MySQL
   - Get connection details
   - Keep it running (free tier)

2. **On Render**:
   - Add environment variables (see Option 1A above)
   - Deploy your app
   - It will connect to Railway MySQL

3. **Both work together**:
   - Railway: MySQL Database
   - Render: PHP Application
   - ✅ Best of both worlds!

