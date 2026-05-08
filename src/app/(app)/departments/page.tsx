'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  color: string;
  department_members?: { id: string }[];
}

export default function DepartmentsPage() {
  const supabase = createClient();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await supabase
          .from('departments')
          .select('id, name, description, emoji, color, department_members(id)')
          .order('name');

        setDepartments(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [supabase]);

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
          Departments
        </h1>
        <p className="text-text-muted">
          Choose a department to start learning and collaborating
        </p>
      </motion.div>

      <div className="space-y-2">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/departments/${dept.id}`}
              className="flex items-center justify-between p-4 bg-bg-surface border border-border hover:border-accent/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl">{dept.emoji}</div>
                <div>
                  <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {dept.name}
                  </p>
                  {dept.description && (
                    <p className="text-sm text-text-muted line-clamp-1">
                      {dept.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Users className="w-4 h-4" />
                <span className="text-sm">{dept.department_members?.length || 0}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
