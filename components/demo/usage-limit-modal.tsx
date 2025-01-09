import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LockKeyhole, Sparkles } from "lucide-react";

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsageLimitModal({ isOpen, onClose }: UsageLimitModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-950/95 border border-purple-300/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <LockKeyhole className="w-5 h-5 text-purple-400" />
            Usage Limit Reached
          </DialogTitle>
          <DialogDescription className="text-purple-200/70">
            You&apos;ve used all your free prompts for today
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="bg-purple-500/10 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Unlock Unlimited Access
              </h4>
              <ul className="space-y-2 text-sm text-purple-200/70">
                <li>• Unlimited AI-powered quiz generation</li>
                <li>• Advanced study planning features</li>
                <li>• Personalized learning insights</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/signin')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              Sign Up Now
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/10"
            >
              Maybe Later
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
