# 🎓 School Hub

A modern, real-time collaboration platform for schools built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- **Real-time Messaging** - Instant communication in departments and school-wide lobby
- **Department Spaces** - Organized channels for different subjects
- **Assignments** - Teachers can post assignments, students can track deadlines
- **Help System** - Post help requests and earn points by assisting others
- **Badge System** - Earn badges for contributions
- **Profile & Points** - Track your achievements and contributions
- **Dark Mode** - Beautiful dark-first design
- **Mobile Responsive** - Works great on phones, tablets, and desktops

## 🚀 Quick Start

### One-Click Setup

The easiest way to get started:

```bash
# Clone the repo
git clone https://github.com/JeroDeGreat/localschool.git
cd localschool

# Run setup script (Linux/Mac)
bash scripts/setup.sh

# Or on Windows
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

This will:
1. Install all dependencies
2. Set up environment variables
3. Apply Supabase migrations
4. Start the development server
5. Open in your browser

### Manual Setup

If the setup script doesn't work:

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (copy from .env.example)
cp .env.example .env.local

# 3. Fill in your Supabase credentials in .env.local

# 4. Run migrations (see below)

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

## 📊 Supabase Setup

### Manual Migration

If migrations aren't applied automatically:

1. Go to your Supabase dashboard
2. Go to SQL Editor
3. Run the SQL files in order:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls.sql`

### Environment Variables

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from your Supabase project settings → API.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google OAuth)
- **Realtime**: Supabase Realtime
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
localschool/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (auth)/       # Auth pages (login, signup)
│   │   ├── (app)/        # Main app pages
│   │   └── auth/         # OAuth callbacks
│   ├── components/       # Reusable components
│   ├── lib/             # Utilities and Supabase client
│   ├── types/           # TypeScript types
│   └── middleware.ts    # Next.js middleware
├── supabase/            # Database migrations
├── scripts/             # Setup and utility scripts
└── public/              # Static files
```

## 🎨 Design

- **Dark-first** aesthetic inspired by Discord, Linear, and Vercel
- **Not card-based** - Clean rows and dividers instead of floating cards
- **Modern typography** - Outfit, DM Mono, Syne fonts
- **Smooth animations** - Framer Motion for polish
- **Responsive** - Mobile-first design

## 📱 Preview

### Pages

- **Dashboard** - Overview with upcoming assignments and stats
- **Departments** - Browse and join department channels
- **Department Chat** - Real-time messaging within a department
- **Assignments** - View and track assignments
- **Help Requests** - Post help requests or answer others
- **Lobby** - School-wide general chat
- **Profile** - Your achievements and badges
- **Settings** - User preferences

## 🔐 Security

- Row-Level Security (RLS) enforced on all tables
- Authentication via Supabase Auth
- Role-based access control (Student/Teacher/Admin)
- Service role key never exposed to frontend

## 📝 Usage

### For Students

1. Sign up with email or Google
2. Join departments
3. Chat in departments and lobby
4. Submit assignments
5. Request help and earn points

### For Teachers

1. Sign up (mark as teacher in profile if needed)
2. Manage departments
3. Post assignments
4. View submissions

### For Admins

1. Manage departments and users
2. Moderate content

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Supabase connection errors

- Check your `.env.local` credentials
- Verify Supabase project is active
- Check network connection

### Migrations not applied

- Go to Supabase SQL Editor
- Copy-paste the SQL files
- Run them in order

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# Set environment variables in project settings
# Deploy!
```

### Docker

```bash
docker build -t school-hub .
docker run -p 3000:3000 school-hub
```

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Pull requests welcome! Please fork and submit PRs.

## 📄 License

MIT - See LICENSE for details

## 🎯 Roadmap

- [ ] Voice/video calls
- [ ] File sharing
- [ ] Advanced search
- [ ] User mentions/notifications
- [ ] Rich text editor
- [ ] Mobile app
- [ ] Analytics dashboard

## 📧 Support

Need help? Open an issue on GitHub or contact the team.

---

Built with ❤️ for schools. **School Hub** - Modern Collaboration for Modern Schools.
