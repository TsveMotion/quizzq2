import { motion } from "framer-motion";

export function AnimatedStepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ 
        scale: 1, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
        }
      }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      className="relative p-8 rounded-xl bg-gradient-to-br from-background to-accent/5 border shadow-lg"
    >
      {/* Animated background number */}
      <motion.div
        className="absolute right-4 top-4 text-8xl font-bold text-primary/5"
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        {number}
      </motion.div>

      {/* Animated circle decorations */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full bg-primary/5"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${i * 60}%`,
              top: `${50 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xl font-semibold mb-3"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}
