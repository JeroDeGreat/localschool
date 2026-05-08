'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, FileText, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: BookOpen, label: 'Depts', href: '/departments' },
  { icon: Users, label: 'Lobby', href: '/lobby' },
  { icon: FileText, label: 'Work', href: '/assignments' },
  { icon: LifeBuoy, label: 'Help', href: '/help' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-subtle border-t border-border flex lg:hidden z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors ${
              isActive ? 'text-accent' : 'text-text-secondary'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-highlight"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                transition={{ duration: 0.2 }}
              />
            )}
            <Icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
