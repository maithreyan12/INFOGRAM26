'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, Ticket, Play, Clock, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export type NotificationType = 'registration_success' | 'payment_success' | 'ticket_generated' | 'event_starting' | 'event_live' | 'custom';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load from local storage
    const stored = localStorage.getItem('infogram_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing notifications', e);
      }
    } else {
      // Mock notifications for demonstration if empty
      const mock: Notification[] = [
        { id: '1', type: 'registration_success', title: 'Registration Successful', message: 'Welcome to INFOGRAM 26!', timestamp: new Date().toISOString(), read: false },
        { id: '2', type: 'ticket_generated', title: 'Ticket Generated', message: 'Your pass for Coding Contest is ready.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false }
      ];
      setNotifications(mock);
      localStorage.setItem('infogram_notifications', JSON.stringify(mock));
    }

    // Click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('infogram_notifications', JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('infogram_notifications', JSON.stringify(updated));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'registration_success':
      case 'payment_success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'ticket_generated': return <Ticket className="w-5 h-5 text-sky-400" />;
      case 'event_starting': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'event_live': return <Play className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
      >
        <Bell className="w-6 h-6 text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B0F19]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary-400 hover:text-primary-300">
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3 rounded-xl flex gap-3 transition-colors cursor-pointer ${
                      notification.read ? 'hover:bg-white/5' : 'bg-white/5 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-sm font-medium truncate ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {formatDateTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
