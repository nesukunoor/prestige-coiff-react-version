# Prestige Coiff & Co - Windows Setup Guide

## Prerequisites

1. **Node.js 20 or higher** - Download from: https://nodejs.org/
2. **XAMPP** - For MySQL database
3. **Git Bash or Command Prompt**

## Step-by-Step Installation

### 1. Extract the Project
Extract the zip file to a folder, for example:
```
C:\prestige-coiff
```

### 2. Install Dependencies

Open **Command Prompt** (not PowerShell) in the project folder:

```cmd
cd C:\prestige-coiff
npm install --legacy-peer-deps
```

This will install all required packages including `cross-env` for Windows compatibility.

### 3. Configure Database

#### Create Database in XAMPP:

**Option A: Using phpMyAdmin**
1. Start XAMPP and click **Start** for MySQL
2. Click **Admin** button next to MySQL
3. In phpMyAdmin, click **"New"** or **"Databases"**
4. Create database named: `prestige_coiff`

**Option B: Using Command Line**
```cmd
cd C:\xampp\mysql\bin
mysql -u root
```
Then in MySQL prompt:
```sql
CREATE DATABASE prestige_coiff;
EXIT;
```

### 4. Create .env File

Create a file named `.env` in the project root folder with this content:

```env
DATABASE_URL=mysql://root:@localhost:3306/prestige_coiff
JWT_SECRET=my-super-secret-key-change-this-in-production
VITE_APP_TITLE=Prestige Coiff & Co
VITE_APP_LOGO=/logo1.png
VITE_APP_ID=prestige-coiff
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
OWNER_OPEN_ID=admin
OWNER_NAME=Admin
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=dummy-key
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**Important Notes:**
- If your MySQL has a password, change the DATABASE_URL to:
  ```
  DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/prestige_coiff
  ```
- Make sure the file is named exactly `.env` (with dot at the beginning, no extension)
- Save it in the root folder: `C:\prestige-coiff\.env`

### 5. Create Database Tables

```cmd
npm run db:push
```

This creates all the necessary tables (products, orders, appointments, etc.)

### 6. Add Sample Data (Optional)

```cmd
npx tsx scripts/seed-data.ts
```

This adds:
- 4 sample products
- 3 sample services

### 7. Start the Development Server

```cmd
npm run dev
```

Wait for the message:
```
Server running on http://localhost:3000/
```

### 8. Open in Browser

Go to: **http://localhost:3000**

## Troubleshooting

### Issue: "cross-env is not recognized"
**Solution:** Make sure you ran `npm install --legacy-peer-deps` first.

### Issue: "Unknown database 'prestige_coiff'"
**Solution:** Create the database in phpMyAdmin or MySQL command line (see Step 3).

### Issue: "Access denied for user 'root'"
**Solution:** 
- Try without password: `mysql -u root` (no `-p` flag)
- Or update your `.env` file with the correct MySQL password

### Issue: "Port 3000 is already in use"
**Solution:** 
- Close any other applications using port 3000
- Or change the port in `vite.config.ts` (line with `port: 3000`)

### Issue: Node.js version too old
**Solution:** Download and install Node.js 20+ from https://nodejs.org/

## Project Structure

```
prestige-coiff/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── pages/      # Website pages
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Appointment.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── admin/  # Admin dashboard pages
│   │   └── components/ # Reusable UI components
│   └── public/         # Static files (logo, images)
├── server/             # Backend Node.js/Express
│   ├── routers.ts      # API endpoints
│   └── db.ts           # Database queries
├── drizzle/            # Database schema
│   └── schema.ts       # Table definitions
└── scripts/            # Utility scripts
    └── seed-data.ts    # Sample data seeder
```

## Available Pages

### Public Pages:
- **Home:** http://localhost:3000/
- **Products:** http://localhost:3000/produits
- **Product Detail:** http://localhost:3000/produit/:id
- **Appointments:** http://localhost:3000/rendez-vous
- **Contact:** http://localhost:3000/contact

### Admin Dashboard:
- **Login:** http://localhost:3000/admin/login (Username: admin, Password: admin123)
- **Dashboard:** http://localhost:3000/admin
- **Products Management:** http://localhost:3000/admin/produits
- **Orders Management:** http://localhost:3000/admin/commandes
- **Clients:** http://localhost:3000/admin/clients
- **Appointments:** http://localhost:3000/admin/rendez-vous
- **Messages:** http://localhost:3000/admin/messages
- **Analytics:** http://localhost:3000/admin/analyses

## Database Tables

The system creates these tables automatically:
- `products` - Product catalog
- `orders` - Customer orders
- `orderItems` - Order line items
- `appointments` - Appointment bookings
- `customers` - Customer information
- `messages` - Contact form messages
- `services` - Barber services
- `revenue` - Revenue tracking by month
- `notifications` - System notifications
- `users` - User accounts (for admin)

## Features

### Customer Features:
- Browse products catalog
- View product details
- Place orders (cash on delivery)
- Book appointments
- Send contact messages

### Admin Features:
- Dashboard with monthly statistics
- Manage products (add/edit/delete)
- Control stock levels
- Create promotions
- Manage orders (update status, track payment)
- View appointments
- Read customer messages
- Track revenue by month
- Generate unique order codes

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Make sure XAMPP MySQL is running
4. Check that the `.env` file is configured correctly

## Production Deployment

For production deployment:
1. Change `JWT_SECRET` to a secure random string
2. Update `DATABASE_URL` with production database credentials
3. Run `npm run build` to create production build
4. Deploy the `dist` folder to your hosting service
5. Make sure Node.js 20+ is available on the server

