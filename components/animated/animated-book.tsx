import { motion } from "framer-motion";
import Image from "next/image";

export function AnimatedBook() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full"
    >
      <div className="relative w-64 h-64 mx-auto">
        <Image
          src="/book-3d.png"
          alt="3D Book"
          layout="fill"
          objectFit="contain"
          className="drop-shadow-2xl"
        />
      </div>
    </motion.div>
  );
}
