'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  whileHover?: boolean;
}

export function AnimatedCard({ children, className = "", delay = 0, whileHover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={whileHover ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
    >
      <Card className={`${className} transition-colors`}>
        {children}
      </Card>
    </motion.div>
  );
}
