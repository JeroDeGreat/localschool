# 🚀 Quick Start - School Hub

## 1️⃣ One-Click Preview (Easiest)

Just run this command from the project root:

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 2️⃣ Setup Supabase (Required for Full Features)

Before using the app, you need to set up your database:

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select or create a project
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **Anon Key** (public key)

### Step 2: Update `.env.local`

Edit `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Apply Database Migrations

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Open `supabase/migrations/001_schema.sql` from this project
4. Copy all the SQL and paste it in Supabase
5. Click **Run**
6. Repeat with `supabase/migrations/002_rls.sql`

### Step 4: Configure OAuth (Optional, but Recommended)

To enable Google Sign-In:

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Google**
3. Set Redirect URL to: `http://localhost:3000/auth/callback`

---

## 3️⃣ Now Start the App

```bash
npm run dev
```

Visit **http://localhost:3000**

### Test Account

After setting up:

1. Click **Sign Up**
2. Create an account
3. You'll automatically be assigned to departments
4. Start exploring!

---

## 📱 Preview Features

### Pages You Can Visit

- **Dashboard** (`/dashboard`) - Overview & stats
- **Departments** (`/departments`) - Browse all departments
- **Assignments** (`/assignments`) - View assignments
- **Help** (`/help`) - Post help requests
- **Lobby** (`/lobby`) - School-wide chat
- **Profile** (`/profile`) - Your badges & achievements

### Try These:

1. **Chat** - Go to a department and send a message
2. **Create Help Request** - Click "New Request" in Help section
3. **View Dashboard** - See your stats and upcoming work

---

## ⚡ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### "Connection refused"
- Check if Supabase credentials in `.env.local` are correct
- Verify Supabase project is active

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```

### Chat not working
- Make sure migrations are applied
- Check browser console for errors (F12)

### Auth not working
- Verify email is configured in Supabase
- Check OAuth redirect URL

---

## 📱 Mobile Preview

The app works on mobile! To test:

1. Get your local IP: `ipconfig getifaddr en0` (Mac) or `hostname -I` (Linux)
2. Visit `http://YOUR_IP:3000` from your phone
3. Test the mobile navigation at the bottom

---

## 🎯 Next Steps

1. ✅ Run the dev server
2. ✅ Sign up an account
3. ✅ Explore the app
4. ✅ Read the main [README.md](./README.md) for full documentation

---

## 💡 Tips

- **Dark mode** is the default - suits late-night studying!
- **Real-time updates** - Open the same chat in 2 browser tabs to see it in action
- **Responsive** - The app looks great on all screen sizes
- **Fast** - Built with Next.js for optimal performance

---

Questions? Check out:
- [README.md](./README.md) - Full documentation
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

Happy learning! 🎓
