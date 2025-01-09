import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AnimatedStepCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

export function AnimatedStepCard({ number, title, description, className }: AnimatedStepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <div className="p-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 text-white font-semibold">
            {number}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}
