import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AnimatedStatsCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

export function AnimatedStatsCard({ number, label, icon, className }: AnimatedStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold mb-1">{number}</div>
            <div className="text-sm opacity-80">{label}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
