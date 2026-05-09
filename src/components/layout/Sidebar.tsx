'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, FileText, LifeBuoy, User, Settings, LogOut, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Departments', href: '/departments' },
  { icon: Users, label: 'Lobby', href: '/lobby' },
  { icon: FileText, label: 'Assignments', href: '/assignments' },
  { icon: Bell, label: 'Announcements', href: '/announcements' },
  { icon: LifeBuoy, label: 'Help', href: '/help' },
];

const bottomItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-bg-subtle border-r border-border flex flex-col hidden lg:flex">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 py-6 border-b border-border hover:bg-bg-surface transition-colors"
      >
        <div className="text-2xl">🎓</div>
        <div>
          <div className="font-bold text-text-primary text-sm">School Hub</div>
          <div className="text-xs text-text-muted">Connect & Learn</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-highlight"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-lg"
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
