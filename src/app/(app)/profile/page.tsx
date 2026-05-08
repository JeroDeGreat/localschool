'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Mail, BarChart3 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  username: string;
  bio: string | null;
  points: number;
  role: string;
  avatar_url: string | null;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string | null;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || '');

          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          setProfile(profileData);

          // Fetch badges
          const { data: badgesData } = await supabase
            .from('user_badges')
            .select('badges(id, name, icon, description)')
            .eq('user_id', user.id);

          setBadges(
            badgesData?.map((ub: any) => ub.badges).filter(Boolean) || []
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-surface border border-border rounded-lg p-6 mb-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
              {profile?.full_name?.[0]?.toUpperCase() || '👤'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {profile?.full_name}
              </h1>
              <p className="text-text-muted">@{profile?.username}</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
            {profile?.role.charAt(0).toUpperCase() + profile?.role.slice(1)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-elevated rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span className="text-text-muted text-sm">Points</span>
            </div>
            <p className="text-2xl font-bold text-accent">{profile?.points || 0}</p>
          </div>
          <div className="bg-bg-elevated rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-text-muted text-sm">Email</span>
            </div>
            <p className="text-sm text-text-primary truncate">{userEmail}</p>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4">Badges</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 bg-bg-surface border border-border rounded-lg text-center hover:border-accent/50 transition-all"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-medium text-text-primary text-sm mb-1">
                  {badge.name}
                </p>
                {badge.description && (
                  <p className="text-xs text-text-muted">{badge.description}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {badges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-12 text-text-muted"
        >
          <p>No badges yet. Start helping others to earn badges!</p>
        </motion.div>
      )}
    </div>
  );
}
