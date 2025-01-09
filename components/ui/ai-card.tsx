import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { motion } from "framer-motion";

interface AICardProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  glowColor?: string;
  headerClassName?: string;
}

export function AICard({
  className,
  children,
  title,
  description,
  glowColor = "rgba(147, 197, 253, 0.3)", // blue-200
  headerClassName,
}: AICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-white/20 bg-white/10 backdrop-blur-md",
        "transition-all duration-300",
        "hover:border-white/30 hover:bg-white/20",
        "dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10",
        "shadow-lg hover:shadow-xl",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        className
      )}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div 
            className="absolute inset-0 opacity-50 blur-xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`
            }}
          />
        </div>

        {(title || description) && (
          <CardHeader className={headerClassName}>
            {title && <CardTitle className="text-white dark:text-white">{title}</CardTitle>}
            {description && <CardDescription className="text-white/80 dark:text-white/70">{description}</CardDescription>}
          </CardHeader>
        )}
        
        <CardContent className="relative">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
