import { motion } from "framer-motion";

export function AnimatedQuote({ quote }: { quote: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true }}
      className="relative p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border shadow-lg"
    >
      {/* Quote marks decoration */}
      <div className="absolute top-4 left-4 text-6xl text-primary/10">"</div>
      <div className="absolute bottom-4 right-4 text-6xl text-primary/10">"</div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-primary/5"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              delay: i * 0.5,
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

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="relative text-xl italic text-center px-12"
      >
        {quote}
      </motion.p>
    </motion.div>
  );
}
