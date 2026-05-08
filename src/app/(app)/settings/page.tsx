'use client';

import { motion } from 'framer-motion';
import { Bell, Shield, Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">
          Settings
        </h1>
        <p className="text-text-muted">Customize your School Hub experience</p>
      </motion.div>

      <div className="space-y-4">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-bg-surface border border-border rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Notifications</p>
                <p className="text-sm text-text-muted">
                  Manage notifications
                </p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 bg-bg-surface border border-border rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Privacy</p>
                <p className="text-sm text-text-muted">
                  Control your privacy settings
                </p>
              </div>
            </div>
            <span className="text-text-muted">→</span>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-bg-surface border border-border rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Dark Mode</p>
                <p className="text-sm text-text-muted">Enabled</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
