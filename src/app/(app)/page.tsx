'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Clock, BookOpen, AlertCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Assignment {
  id: string;
  title: string;
  due_date: string | null;
  department_id: string;
  departments?: { name: string; emoji: string };
}

export default function Dashboard() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        // Fetch upcoming assignments
        const { data: assignmentData } = await supabase
          .from('assignments')
          .select('id, title, due_date, department_id, departments(name, emoji)')
          .order('due_date', { ascending: true })
          .limit(5);

        setAssignments(assignmentData || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-bg-surface rounded-lg"></div>
          <div className="h-40 bg-bg-surface rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">
          Welcome back, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-text-muted">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-surface border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Your Points</p>
              <p className="text-2xl font-bold text-accent">{profile?.points || 0}</p>
            </div>
            <Star className="w-8 h-8 text-accent/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-bg-surface border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Pending Work</p>
              <p className="text-2xl font-bold text-blue-400">{assignments.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-surface border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Streak</p>
              <p className="text-2xl font-bold text-green-400">7 days</p>
            </div>
            <AlertCircle className="w-8 h-8 text-green-400/30" />
          </div>
        </motion.div>
      </div>

      {/* Upcoming Assignments */}
      {assignments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Upcoming Work
          </h2>
          <div className="space-y-2 mb-8">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-bg-surface border border-border hover:border-accent/50 rounded-lg transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {assignment.title}
                  </p>
                  <p className="text-sm text-text-muted">
                    📚 {assignment.departments?.name}
                  </p>
                </div>
                {assignment.due_date && (
                  <p className="text-sm text-text-muted ml-4 flex-shrink-0">
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Browse Departments', href: '/departments', emoji: '📚' },
            { label: 'Join Lobby', href: '/lobby', emoji: '👥' },
            { label: 'Ask for Help', href: '/help', emoji: '🙋' },
            { label: 'Your Profile', href: '/profile', emoji: '👤' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 bg-bg-surface border border-border hover:border-accent/50 rounded-lg transition-all text-center group"
            >
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
