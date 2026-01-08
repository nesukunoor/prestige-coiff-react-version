# Prestige Coiff & Co - Professional Barber Shop Website

A complete, professional barber shop website with customer-facing features and admin dashboard.

##  Quick Start for Windows

### Prerequisites
- **Node.js 20+** (Download: https://nodejs.org/)
- **XAMPP** (For MySQL database)

### Installation Steps

1. **Extract the project** to a folder (e.g., `C:\prestige-coiff`)

2. **Create the database** in XAMPP:
   - Start XAMPP and start MySQL
   - Open phpMyAdmin (click Admin button)
   - Create a new database named: `prestige_coiff`

3. **Create .env file**:
   - Copy the content from `ENV_TEMPLATE.txt`
   - Create a new file named `.env` in the project root
   - Paste the content and save

4. **Run the setup script**:
   - Double-click `START_WINDOWS.bat`
   - Or open Command Prompt and run:
     ```cmd
     npm install --legacy-peer-deps
     npm run db:push
     npx tsx scripts/seed-data.ts
     npm run dev
     ```

5. **Open your browser**: http://localhost:3000

 **For detailed instructions, see `WINDOWS_SETUP.md`**

##  Features

### Customer Features
- 🏠 Professional homepage with services showcase
- 🛍️ Product catalog with search and filtering
- 📦 Product detail pages with order forms
- 📅 Appointment booking system
- 📧 Contact form

### Admin Dashboard
- 📊 Dashboard with monthly statistics
- 📦 Product management (add/edit/delete, stock control, promotions)
- 🛒 Order management (status tracking, payment tracking)
- 👥 Customer management
- 📅 Appointment management
- 💬 Message inbox
- 💰 Revenue tracking by month
- 🔔 Notification system

## Design

Professional black, grey, and white color palette with subtle gold accents. Fully responsive and mobile-friendly.

## Database

Comprehensive database schema with 10 tables:
- Products, Orders, Order Items
- Appointments, Services
- Customers, Messages
- Revenue tracking
- Notifications
- User accounts

## Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, tRPC
- **Database:** MySQL/MariaDB (via XAMPP)
- **UI Components:** shadcn/ui, Radix UI
- **State Management:** TanStack Query

## Pages

### Public Pages
- `/` - Home
- `/produits` - Products catalog
- `/produit/:id` - Product detail
- `/rendez-vous` - Appointment booking
- `/contact` - Contact form

### Admin Pages
- `/admin/login` - Admin login (Username: admin, Password: admin123)
- `/admin` - Dashboard
- `/admin/produits` - Products management
- `/admin/commandes` - Orders management
- `/admin/clients` - Customers
- `/admin/rendez-vous` - Appointments
- `/admin/messages` - Messages
- `/admin/analyses` - Analytics

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Create/update database tables
npm run check        # Type checking
npm run test         # Run tests
```

## License

MIT License - Feel free to use for your projects

## Support

For issues:
1. Check `WINDOWS_SETUP.md` for troubleshooting
2. Verify Node.js version: `node --version` (should be 20+)
3. Ensure XAMPP MySQL is running
4. Check `.env` file configuration

---

Made with Luv❤️ By Noor 

