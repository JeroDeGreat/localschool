'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  points: number;
  department_id: string;
  departments?: { name: string; emoji: string };
}

export default function AssignmentsPage() {
  const supabase = createClient();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await supabase
          .from('assignments')
          .select('id, title, description, due_date, points, department_id, departments(name, emoji)')
          .order('due_date', { ascending: true });

        setAssignments(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [supabase]);

  const isOverdue = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const daysUntilDue = (date: string | null) => {
    if (!date) return null;
    const days = Math.ceil(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">
          Assignments
        </h1>
        <p className="text-text-muted">
          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No assignments yet</p>
          </div>
        ) : (
          assignments.map((assignment, index) => {
            const daysLeft = daysUntilDue(assignment.due_date);
            const overdue = isOverdue(assignment.due_date);

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-bg-surface border border-border rounded-lg hover:border-accent/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-2">
                      {assignment.departments?.emoji} {assignment.departments?.name}
                    </p>
                    {assignment.description && (
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {assignment.due_date && (
                      <div
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                          overdue
                            ? 'bg-red-500/10 text-red-400'
                            : daysLeft && daysLeft <= 3
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {overdue
                          ? 'Overdue'
                          : daysLeft === 0
                          ? 'Today'
                          : daysLeft === 1
                          ? 'Tomorrow'
                          : `${daysLeft} days`}
                      </div>
                    )}
                    <div className="text-xs text-text-muted">
                      {assignment.points} pts
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
