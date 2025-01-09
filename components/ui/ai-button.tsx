import { cn } from "@/lib/utils";
import { Button } from "./button";
import { forwardRef } from "react";
import { motion } from "framer-motion";

interface AIButtonProps extends React.ComponentProps<typeof Button> {
  glowColor?: string;
  children: React.ReactNode;
}

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(
  ({ className, glowColor = "rgba(147, 197, 253, 0.3)", children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <div
          className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`
          }}
        />
        <Button
          ref={ref}
          className={cn(
            "relative",
            "bg-white/10 text-white hover:bg-white/20",
            "border border-white/20 hover:border-white/40",
            "dark:bg-white/5 dark:hover:bg-white/10",
            "dark:border-white/10 dark:hover:border-white/20",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-300",
            className
          )}
          {...props}
        >
          <span className="relative z-10 flex items-center">
            {children}
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
        </Button>
      </motion.div>
    );
  }
);

AIButton.displayName = "AIButton";
