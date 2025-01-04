import { motion } from "framer-motion";

export function AnimatedBook() {
  return (
    <motion.div
      initial={{ x: -1000, rotate: -45 }}
      animate={{ 
        x: 0,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 1
        }
      }}
      className="absolute right-10 top-1/2 -translate-y-1/2 w-72 h-96 perspective-1000"
    >
      {/* Book Cover */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: [0, -10, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        className="relative w-full h-full"
      >
        {/* Front Cover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 rounded-lg shadow-2xl border-t-8 border-r-4 border-accent">
          {/* Book Title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 1, duration: 0.5 }
              }}
              className="text-center"
            >
              <div className="text-2xl font-bold mb-2">QUIZZQ</div>
              <div className="text-sm opacity-80">Your AI Learning Companion</div>
            </motion.div>
          </div>

          {/* Decorative Lines */}
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-2">
            <div className="w-16 h-0.5 bg-white/20 rounded"></div>
            <div className="w-12 h-0.5 bg-white/20 rounded"></div>
          </div>
        </div>

        {/* Book Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-primary to-primary/80 transform -skew-y-12"></div>

        {/* Book Pages */}
        <div className="absolute right-2 top-2 bottom-2 w-4 bg-white/90 rounded-r transform">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute right-0 top-0 bottom-0 w-full bg-white border-r border-gray-100"
              style={{
                transform: `translateX(${i * -1}px)`,
                opacity: 1 - i * 0.15,
              }}
            ></div>
          ))}
        </div>
      </motion.div>

      {/* Floating Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20, y: -20 }}
          animate={{
            opacity: [0, 1, 0],
            x: [-20, 20],
            y: [-20, -40],
            transition: {
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
          className="absolute -left-4 top-1/2 w-8 h-8 text-primary"
        >
          <div className="w-full h-full bg-primary/10 rounded-full" />
        </motion.div>
      ))}
    </motion.div>
  );
}
