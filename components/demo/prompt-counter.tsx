import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface PromptCounterProps {
  promptsUsed: number;
  maxPrompts: number;
}

export function PromptCounter({ promptsUsed, maxPrompts }: PromptCounterProps) {
  const router = useRouter();
  const promptsRemaining = maxPrompts - promptsUsed;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          className="bg-gray-900/95 border border-purple-500/20 backdrop-blur-lg rounded-lg shadow-lg p-4 min-w-[280px]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-100">
                  Free Prompts
                </span>
              </div>
              <button
                onClick={() => router.push('/signin')}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Get Unlimited →
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(promptsUsed / maxPrompts) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200">
                  {promptsUsed} / {maxPrompts} used
                </span>
                <span className="text-purple-400">
                  {promptsRemaining} remaining
                </span>
              </div>
            </div>

            {promptsRemaining <= 1 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-purple-300/70 mt-2"
              >
                ⚡ Running low! Sign up for unlimited access
              </motion.p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
