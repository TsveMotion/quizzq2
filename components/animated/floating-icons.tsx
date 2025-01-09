import { motion } from "framer-motion";
import { Book, Brain, Calculator, Globe2 } from "lucide-react";

interface FloatingIconsProps {
  className?: string;
}

export function FloatingIcons({ className }: FloatingIconsProps) {
  return (
    <div className={`${className} absolute inset-0 overflow-hidden pointer-events-none`}>
      <motion.div
        className="absolute"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "20%", left: "10%" }}
      >
        <Brain className="w-8 h-8 text-blue-400/40" />
      </motion.div>

      <motion.div
        className="absolute"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "40%", right: "15%" }}
      >
        <Book className="w-8 h-8 text-purple-400/40" />
      </motion.div>

      <motion.div
        className="absolute"
        animate={{
          y: [0, -15, 0],
          x: [0, -5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "30%", left: "20%" }}
      >
        <Calculator className="w-8 h-8 text-indigo-400/40" />
      </motion.div>

      <motion.div
        className="absolute"
        animate={{
          y: [0, 15, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "20%", right: "25%" }}
      >
        <Globe2 className="w-8 h-8 text-blue-400/40" />
      </motion.div>
    </div>
  );
}
