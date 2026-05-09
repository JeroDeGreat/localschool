# 🏗️ Building School Hub - Get Started Guide

Welcome! Let's start building your School Hub instance. This guide walks you through everything from setup to customization.

---

## ⚡ QUICK START (5 MINUTES)

### 1. Start the Development Server

```bash
cd /home/claude/localschool
npm run dev
```

You should see:
```
▲ Next.js 15.3.2 (Turbopack)
- Local:        http://localhost:3000
```

### 2. Open in Browser

Go to **http://localhost:3000**

You'll see the login page! 🎉

### 3. What You'll See

**Login Page Features:**
- Email sign-in input
- Password input
- "Sign in with Google" button
- Link to signup page
- Beautiful dark UI

### 4. Create a Test Account

Click "Sign Up" and:
1. Enter a name (e.g., "John Doe")
2. Enter an email (e.g., "john@school.local")
3. Enter a password
4. Click "Create Account"

✅ You're logged in! (See dashboard)

---

## 🎯 WHAT TO BUILD NEXT

### Phase 1: Database Setup (Optional but Recommended)

To enable chat, assignments, and help features:

1. Go to https://app.supabase.com
2. Log in to your project: `ugovqaddhzkgrjhxcqwh`
3. Go to **SQL Editor**
4. Create new query
5. Copy the entire SQL from: `supabase/migrations/001_schema.sql`
6. Paste into Supabase and click **Run**
7. Repeat for: `supabase/migrations/002_rls.sql`

**What this does:**
- Creates 13 database tables
- Adds 9 departments
- Adds 6 badges
- Sets up security (RLS)

Once applied, all features work:
- Real-time chat ✓
- Assignments ✓
- Help system ✓
- Profile badges ✓

---

## 🛠️ BUILD YOUR OWN FEATURES

### Example 1: Add a New Page

**Goal**: Create a new "Announcements" page

**Steps:**

1. **Create the file**: `src/app/(app)/announcements/page.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';

export default function AnnouncementsPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">
          Announcements
        </h1>
        <p className="text-text-muted">
          Latest news and updates from school
        </p>
      </motion.div>

      {/* Add your content here */}
      <div className="p-4 bg-bg-surface border border-border rounded-lg">
        <p className="text-text-primary">No announcements yet</p>
      </div>
    </div>
  );
}
```

2. **Add to sidebar**: Edit `src/components/layout/Sidebar.tsx`

Find the `navItems` array and add:
```typescript
{ icon: Megaphone, label: 'Announcements', href: '/announcements' },
```

3. **Add the icon**: Import at top
```typescript
import { Megaphone } from 'lucide-react';
```

4. **Test it**: Your new page appears in sidebar!

---

### Example 2: Customize Colors

**Goal**: Change the accent color from purple to blue

**Edit**: `tailwind.config.ts`

Find:
```typescript
accent: {
  DEFAULT: "#7c6eff", // ← Change this
  muted: "#4f46b3",
  glow: "rgba(124,110,255,0.15)",
  soft: "rgba(124,110,255,0.08)",
},
```

Change to blue:
```typescript
accent: {
  DEFAULT: "#3b82f6",      // ← Beautiful blue
  muted: "#1d4ed8",
  glow: "rgba(59,130,246,0.15)",
  soft: "rgba(59,130,246,0.08)",
},
```

**Refresh browser** - All accent colors are now blue! ✨

---

### Example 3: Add a Database Feature

**Goal**: Display announcements from Supabase

**Edit**: `src/app/(app)/announcements/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_global', true)
          .order('created_at', { ascending: false });

        setAnnouncements(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [supabase]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8 font-display">
        Announcements
      </h1>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-text-muted">No announcements yet</p>
        ) : (
          announcements.map((ann, i) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-bg-surface border border-border rounded-lg hover:border-accent/50 transition-all"
            >
              <h3 className="font-semibold text-text-primary mb-2">
                {ann.title}
              </h3>
              <p className="text-text-secondary text-sm mb-2">
                {ann.content}
              </p>
              <p className="text-xs text-text-muted">
                {new Date(ann.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Now:**
1. Restart dev server
2. Go to `/announcements`
3. It fetches from database automatically!

---

## 🎨 CUSTOMIZATION OPTIONS

### 1. Change Brand Name

**Edit**: `src/components/layout/Sidebar.tsx`

```typescript
<div className="font-bold text-text-primary text-sm">Your School Name</div>
<div className="text-xs text-text-muted">Your tagline here</div>
```

### 2. Change Colors

**Edit**: `tailwind.config.ts` theme section
```typescript
colors: {
  bg: {
    base: "#000000",        // Background color
    subtle: "#111111",      // Subtle elements
    surface: "#1a1a1a",     // Surfaces
  },
  accent: {
    DEFAULT: "#your-color", // Main accent
  },
  text: {
    primary: "#ffffff",     // Main text
    secondary: "#999999",   // Secondary text
  },
}
```

### 3. Change Departments

**Edit**: `supabase/migrations/001_schema.sql`

Find the `INSERT INTO departments` section and modify or add:
```sql
INSERT INTO public.departments (name, description, icon, color, emoji) VALUES
('Physics Lab', 'Advanced Physics', '⚛️', '#3b82f6', '⚛️'),
```

Then re-apply migrations (or manually insert via Supabase).

### 4. Change Fonts

**Edit**: `src/app/layout.tsx`

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  variable: "--font-outfit",
  // ... config
});
```

Then use in Tailwind config.

---

## 📊 FEATURE CHECKLIST

Track what you've built:

- [ ] Server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Created test account
- [ ] Applied database migrations (optional)
- [ ] Added custom page
- [ ] Changed colors
- [ ] Modified sidebar
- [ ] Tested all pages
- [ ] Customized brand name
- [ ] Tested real-time features (with DB)

---

## 🐛 TROUBLESHOOTING

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
# Now runs on http://localhost:3001
```

### Changes Not Showing
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### Database Features Not Working
1. Check if migrations were applied
2. Verify `.env.local` has correct Supabase URL
3. Check browser console for errors (F12)

### Styles Not Updating
```bash
# Tailwind might need rebuild
npm run dev
# Or restart the dev server
```

---

## 🚀 NEXT STEPS

### Immediate
1. ✅ Run dev server
2. ✅ Create test account
3. ✅ Explore all pages
4. ✅ Apply migrations (optional)

### This Week
1. Customize colors & branding
2. Add new pages
3. Connect to your Supabase
4. Test real-time features
5. Invite users

### This Month
1. Deploy to Vercel
2. Set up custom domain
3. Configure email (if desired)
4. Add more features
5. Launch to your school!

---

## 💡 DEVELOPMENT TIPS

### 1. Use the Component Patterns

All pages follow this pattern:
```typescript
'use client';
import { motion } from 'framer-motion';

export default function PageName() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div>
        <h1>Title</h1>
      </motion.div>

      {/* Content */}
      <div className="space-y-3">
        {/* List items, cards, etc */}
      </div>
    </div>
  );
}
```

### 2. Use Tailwind Classes

```typescript
// Colors
className="text-text-primary"      // Main text
className="text-text-secondary"    // Secondary
className="text-text-muted"        // Muted
className="bg-bg-surface"          // Surface
className="border-border"          // Borders
className="text-accent"            // Accent color

// Layouts
className="p-4 lg:p-6"             // Responsive padding
className="max-w-4xl mx-auto"      // Max width + center
className="space-y-3"              // Vertical spacing
className="flex items-center gap-3" // Flex layout

// States
className="hover:border-accent"    // Hover effect
className="transition-all"         // Smooth transition
className="rounded-lg"             // Rounded corners
```

### 3. Add Real-time Features

```typescript
// Subscribe to changes
const channel = supabase
  .channel('table-name')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'table_name'
  }, (payload) => {
    // Handle new data
  })
  .subscribe();

// Remember to cleanup
return () => supabase.removeChannel(channel);
```

### 4. Use Animations

```typescript
// Fade in with delay
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
  Content
</motion.div>
```

---

## 📚 REFERENCE FILES

When building, refer to these working examples:

**Chat Implementation**: `src/app/(app)/departments/[id]/page.tsx`
- Real-time messaging
- Message list
- Input form
- Auto-scrolling

**List Implementation**: `src/app/(app)/assignments/page.tsx`
- Data fetching
- Filtering
- Status badges
- Responsive layout

**Form Implementation**: `src/app/(auth)/signup/page.tsx`
- Form handling
- Error states
- Loading states
- Success feedback

**Real-time Integration**: `src/app/(app)/lobby/page.tsx`
- Supabase subscriptions
- Auto-update lists
- Live messaging

---

## ✨ YOU'RE READY!

Everything is set up. You can now:
1. Start the server
2. Create features
3. Test them
4. Deploy when ready

**Start with**:
```bash
npm run dev
```

Then pick an example above and start building!

---

## 🎓 Happy Building!

School Hub is your foundation. Customize it, add features, and make it yours.

Questions? Check the docs:
- INDEX.md - Navigation
- README.md - Features
- SETUP_GUIDE.md - Configuration

Happy coding! 🚀
