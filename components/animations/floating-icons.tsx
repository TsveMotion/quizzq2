'use client';

import { Brain, GraduationCap, Sparkles, Target, BookOpen, MessageSquareMore } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingIcons() {
  const icons = [
    { Icon: Brain, delay: 0 },
    { Icon: GraduationCap, delay: 0.2 },
    { Icon: Sparkles, delay: 0.4 },
    { Icon: Target, delay: 0.6 },
    { Icon: BookOpen, delay: 0.8 },
    { Icon: MessageSquareMore, delay: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10"
          initial={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: 0,
            opacity: 0 
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay,
            ease: "linear",
          }}
          style={{
            left: `${(index % 3) * 33 + Math.random() * 20}%`,
            top: `${Math.floor(index / 3) * 33 + Math.random() * 20}%`,
          }}
        >
          <Icon className="h-16 w-16 md:h-24 md:w-24" />
        </motion.div>
      ))}
    </div>
  );
}
