# 🛠️ Complete Setup Guide - School Hub

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- A Supabase account (free at https://supabase.com)

---

## Part 1: Initial Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JeroDeGreat/localschool.git
cd localschool
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 15
- Supabase JS client
- Tailwind CSS
- Framer Motion
- And more...

---

## Part 2: Supabase Configuration

### 1. Create/Select Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project" or select existing
3. Choose a region closest to you
4. Create the project (takes ~2 min)

### 2. Get Your Credentials

Once your project is created:

1. Click **Settings** (gear icon bottom left)
2. Click **API**
3. Copy and save:
   - **Project URL**
   - **Anon (public) key**
   - **Service Role key** (keep this SECRET!)

Example:
```
Project URL: https://ugovqaddhzkgrjhxcqwh.supabase.co
Anon Key:    sb_publishable_xxxxx...
Service Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create `.env.local` File

In your project root, create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT:**
- Never commit `.env.local` to git
- Never share your service role key
- `.env.local` is in `.gitignore` - it won't be committed

---

## Part 3: Database Setup

### Option A: Automatic (Recommended for First Time)

Run the provided migration helper:

```bash
node apply-migrations.js
```

This will show you step-by-step instructions.

### Option B: Manual Via Supabase Dashboard

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Name it "01_Schema"
4. Open file: `supabase/migrations/001_schema.sql`
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL editor
7. Click **Run**

Wait for it to complete (you'll see ✓ checks)

8. Repeat for `supabase/migrations/002_rls.sql`:
   - Click **New Query**
   - Name it "02_RLS"
   - Copy from `supabase/migrations/002_rls.sql`
   - Paste and Run

✓ Your database is now set up!

### What the Migrations Do

**001_schema.sql** creates:
- `profiles` - User profile information
- `departments` - Subject/class departments
- `department_members` - User-department relationships
- `messages` - Chat messages
- `assignments` - Teacher assignments
- `submissions` - Student work submissions
- `help_requests` - Help requests from students
- `help_responses` - Responses to help requests
- `badges` - Achievement badges
- `user_badges` - User achievements
- `notifications` - User notifications
- `announcements` - School announcements
- Plus indexes and sample data

**002_rls.sql** creates:
- Row Level Security policies
- Role-based access control
- Data protection rules

---

## Part 4: Authentication Setup

### Email Authentication (Built-in)

Email auth works out of the box after migrations. Users can:
1. Sign up with email
2. Get confirmation email
3. Log in

To test in development:
- Check the "Email Confirmations" tab in Supabase Auth
- Or disable email confirmation (in Auth settings if testing)

### Google OAuth (Optional but Recommended)

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret
6. Go to Supabase → **Authentication** → **Providers**
7. Enable **Google**
8. Paste Client ID and Secret
9. Click **Save**

Now users can "Sign in with Google"!

---

## Part 5: Development Server

### Start the App

```bash
npm run dev
```

You should see:
```
> localschool@1.0.0 dev
> next dev --turbopack

  ▲ Next.js 15.3.2 (Turbopack)
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### First Visit

1. Open http://localhost:3000
2. You'll be redirected to login
3. Click **Sign Up**
4. Create an account with email
5. You'll be logged in and redirected to dashboard

---

## Part 6: Test the Features

### 1. Test Departments

- Go to **Departments** page
- You should see 9 departments listed:
  - Science 🔬
  - ICT 💻
  - Mathematics ∑
  - Engineering ⚙️
  - Arts 🎨
  - English 📝
  - History 🏛️
  - Music 🎵
  - PE ⚽

### 2. Test Chat

- Click a department
- Type a message
- Send it
- You should see the message appear!
- Open the same department in another tab/browser - you'll see real-time sync

### 3. Test Dashboard

- Go to **Dashboard**
- You should see:
  - Welcome message
  - Your points (starts at 0)
  - Pending assignments count
  - Quick access buttons

### 4. Test Help System

- Go to **Help**
- Click **New Request**
- Fill in title and description
- Submit
- Your request appears in the list!

---

## Part 7: Database Troubleshooting

### Check Migrations Applied

Go to Supabase SQL Editor and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see all 13 tables.

### Check Data

View departments:
```sql
SELECT * FROM public.departments;
```

You should see 9 rows with department data.

### Check RLS Policies

Go to **Auth** → **Policies** - you should see dozens of policies listed.

### Common Issues

**"relation does not exist"**
- Migrations weren't applied
- Run migrations again

**"Permission denied"**
- RLS policy is blocking access
- Check Supabase > Auth > Policies

**"No rows returned"**
- Data hasn't been inserted
- Rerun 001_schema.sql (contains INSERT statements)

---

## Part 8: Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for client | `sb_publishable_xxx` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key for server (NEVER expose) | JWT string |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` |

---

## Part 9: Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
6. Click Deploy!

Your app is now live! 🚀

---

## Part 10: Next Steps

### Explore the Code

Key files to understand:
- `src/lib/supabase/client.ts` - Client-side Supabase setup
- `src/app/(auth)/login/page.tsx` - Authentication flow
- `src/app/(app)/departments/[id]/page.tsx` - Real-time chat example
- `supabase/migrations/001_schema.sql` - Database schema

### Read Documentation

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com)

### Customize

- Change colors in `tailwind.config.ts`
- Add new features using Supabase tables
- Modify migrations for custom schema

---

## 🎯 You're All Set!

Your School Hub installation is complete! 

### Summary of What You Did

✅ Cloned the project
✅ Installed dependencies
✅ Set up Supabase account
✅ Applied database migrations
✅ Configured environment variables
✅ Started development server
✅ Tested all features

### Quick Commands to Remember

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
git push

# View logs
npm run dev -- -p 3001 (different port)
```

---

## 💬 Support

Issues? Check:
1. [GitHub Issues](https://github.com/JeroDeGreat/localschool/issues)
2. [Supabase Docs](https://supabase.com/docs)
3. [Next.js Docs](https://nextjs.org/docs)

---

**Happy coding! 🎓**

School Hub is ready to bring modern collaboration to your school.
