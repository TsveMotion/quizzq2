'use client';

import { motion } from 'framer-motion';
import { Brain, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    {
      id: 'ai-tutor',
      label: 'QuizzQ AI',
      icon: Brain,
    },
    {
      id: 'quiz-generator',
      label: 'Quiz Generator',
      icon: FileText,
    },
    {
      id: 'study-planner',
      label: 'Study Planner',
      icon: Calendar,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mb-8 w-full overflow-hidden rounded-2xl bg-white/10 p-1 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/90 via-violet-600/90 to-indigo-600/90"
                  style={{
                    zIndex: -1,
                  }}
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
