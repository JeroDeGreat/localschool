'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: { full_name: string };
}

export default function LobbyPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        // Fetch lobby messages
        const { data: msgData } = await supabase
          .from('messages')
          .select('id, content, sender_id, created_at, profiles(full_name)')
          .eq('is_lobby', true)
          .order('created_at', { ascending: true })
          .limit(100);

        setMessages(msgData || []);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages:lobby')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'is_lobby=eq.true',
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        content: input,
        is_lobby: true,
        sender_id: currentUserId,
      });

      if (!error) {
        setInput('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-60px)] lg:h-screen flex flex-col bg-bg-base">
      {/* Header */}
      <div className="border-b border-border p-4 lg:p-6 bg-bg-subtle">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary">
            School Lobby
          </h1>
          <p className="text-text-muted text-sm">
            Connect with the entire school community
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-4xl mx-auto w-full space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`flex gap-3 ${
              msg.sender_id === currentUserId ? 'justify-end' : ''
            }`}
          >
            {msg.sender_id !== currentUserId && (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs flex-shrink-0">
                {msg.profiles?.full_name?.[0]?.toUpperCase()}
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md ${
                msg.sender_id === currentUserId
                  ? 'bg-accent text-bg-base rounded-2xl rounded-br-sm'
                  : 'bg-bg-surface text-text-primary rounded-2xl rounded-bl-sm'
              } px-4 py-2`}
            >
              {msg.sender_id !== currentUserId && (
                <p className="text-xs font-medium mb-1 opacity-75">
                  {msg.profiles?.full_name}
                </p>
              )}
              <p className="text-sm break-words">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-border p-4 lg:p-6 bg-bg-subtle"
      >
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something to the school..."
            className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-muted text-bg-base p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
