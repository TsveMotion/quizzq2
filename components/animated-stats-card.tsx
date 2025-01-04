import { motion } from "framer-motion";

export function AnimatedStatsCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      className="relative p-6 rounded-xl bg-gradient-to-br from-background to-accent/5 border shadow-lg"
    >
      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full bg-primary/5"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-primary mb-2"
        >
          {number}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-sm text-muted-foreground"
        >
          {label}
        </motion.div>
      </div>
    </motion.div>
  );
}
