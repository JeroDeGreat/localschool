'use client';

import { motion } from 'framer-motion';
import { Bell, Calendar, User } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  important?: boolean;
}

// Sample announcements (replace with database query later)
const announcements: Announcement[] = [
  {
    id: 1,
    title: '🎉 Spring Festival Announcement',
    content:
      "This year's Spring Festival will be held on March 15th. All students and teachers are invited to participate in various activities and performances.",
    author: 'Principal Johnson',
    date: 'March 10, 2025',
    important: true,
  },
  {
    id: 2,
    title: 'Library Extension Hours',
    content:
      'The school library will now be open until 6 PM on weekdays to give students more study time.',
    author: 'Librarian Smith',
    date: 'March 8, 2025',
  },
  {
    id: 3,
    title: '📚 New Science Lab Equipment',
    content:
      'The science lab has received new equipment for advanced physics experiments. Please register with your teacher to use the lab.',
    author: 'Science Department',
    date: 'March 5, 2025',
  },
  {
    id: 4,
    title: 'Sports Day Tryouts',
    content:
      'Tryouts for the upcoming inter-school sports competition will be held next week. Sign up in the sports office.',
    author: 'Coach Davis',
    date: 'March 1, 2025',
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold text-text-primary font-display">
            Announcements
          </h1>
        </div>
        <p className="text-text-muted">
          Latest news and updates from your school
        </p>
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-text-muted">No announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border rounded-lg transition-all hover:border-accent/50 ${
                announcement.important
                  ? 'bg-accent/5 border-accent/30'
                  : 'bg-bg-surface border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Indicator dot */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      announcement.important ? 'bg-accent' : 'bg-text-muted'
                    }`}
                  ></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary mb-1 text-lg">
                    {announcement.title}
                  </h3>
                  <p className="text-text-secondary mb-3 leading-relaxed">
                    {announcement.content}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{announcement.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>

                {/* Important Badge */}
                {announcement.important && (
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">
                      Important
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
