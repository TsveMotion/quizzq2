import { motion } from "framer-motion";
import { Brain, BookOpen, GraduationCap, Target, Users } from "lucide-react";

export function FloatingIcons() {
  const icons = [
    { icon: Brain, color: "text-primary" },
    { icon: BookOpen, color: "text-accent" },
    { icon: GraduationCap, color: "text-primary" },
    { icon: Target, color: "text-accent" },
    { icon: Users, color: "text-primary" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className={`absolute ${Icon.color}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * -100],
          }}
          transition={{
            duration: 3,
            delay: index * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${20 + index * 15}%`,
            top: "60%",
          }}
        >
          <Icon.icon className="w-8 h-8" />
        </motion.div>
      ))}
    </div>
  );
}
