import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FloatingIcons } from "@/components/animated/floating-icons";

interface FuturisticContainerProps {
  children: React.ReactNode;
  className?: string;
  showFloatingIcons?: boolean;
  fullHeight?: boolean;
}

interface FloatingIconsProps {
  className?: string;
}

interface FloatingIcons {
  (props: FloatingIconsProps): JSX.Element;
}

export function FuturisticContainer({ 
  children, 
  className,
  showFloatingIcons = true,
  fullHeight = false,
}: FuturisticContainerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900",
      fullHeight && "min-h-screen",
      className
    )}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-4 -left-4 h-96 w-96 rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-3xl" />
        <div className="animate-float-medium absolute top-1/2 -right-32 h-[40rem] w-[40rem] rounded-full bg-purple-400/30 dark:bg-purple-500/20 blur-3xl" />
        <div className="animate-float-fast absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-grid-white/[0.2] dark:bg-grid-white/[0.1] bg-[size:20px_20px] animate-grid" />
      {showFloatingIcons && <FloatingIcons className="absolute inset-0 opacity-30 dark:opacity-20" />}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-white/80 dark:from-background/20 dark:via-background/60 dark:to-background/90 backdrop-blur-[2px]" />

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
