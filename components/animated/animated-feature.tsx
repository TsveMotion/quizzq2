import { motion } from "framer-motion";

interface AnimatedFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function AnimatedFeature({ title, description, icon, className }: AnimatedFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-start gap-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </motion.div>
  );
}
