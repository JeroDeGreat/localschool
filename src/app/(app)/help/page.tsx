'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Plus, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface HelpRequest {
  id: string;
  title: string;
  description: string | null;
  status: string;
  points_reward: number;
  requester_id: string;
  created_at: string;
  profiles?: { full_name: string };
  help_responses?: { id: string }[];
}

export default function HelpPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await supabase
          .from('help_requests')
          .select(
            'id, title, description, status, points_reward, requester_id, created_at, profiles(full_name), help_responses(id)'
          )
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        setRequests(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('help_requests').insert({
          title: formData.title,
          description: formData.description,
          requester_id: user.id,
        });

        if (!error) {
          setFormData({ title: '', description: '' });
          setShowForm(false);
          // Refresh list
          const { data } = await supabase
            .from('help_requests')
            .select(
              'id, title, description, status, points_reward, requester_id, created_at, profiles(full_name), help_responses(id)'
            )
            .eq('status', 'open')
            .order('created_at', { ascending: false });
          setRequests(data || []);
        }
      }
    } catch (err) {
      console.error('Error creating help request:', err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">
            Help Requests
          </h1>
          <p className="text-text-muted">
            Ask for help or assist your peers
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-muted text-bg-base px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </motion.div>

      {/* Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-bg-surface border border-border rounded-lg mb-6 space-y-4"
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What do you need help with?"
            className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add more details (optional)..."
            className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-muted text-bg-base px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Post Request
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-bg-elevated border border-border hover:border-accent text-text-primary px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Requests */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No open help requests</p>
          </div>
        ) : (
          requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-bg-surface border border-border rounded-lg hover:border-accent/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary mb-1">
                    {request.title}
                  </h3>
                  <p className="text-sm text-text-muted mb-2">
                    by {request.profiles?.full_name}
                  </p>
                  {request.description && (
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {request.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-sm text-accent font-medium">
                    ⭐ {request.points_reward} pts
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <MessageCircle className="w-3 h-3" />
                    {request.help_responses?.length || 0} responses
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
