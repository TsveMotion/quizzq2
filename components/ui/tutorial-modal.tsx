'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a237e] border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-300" />
            Tutorial Not Available
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-white/80 mb-4">
            This tutorial is not available yet as QuizzQ is currently in beta. We're working hard to create comprehensive tutorials for all features.
          </p>
          <p className="text-white/80">
            Please check back soon or contact support if you need immediate assistance.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-white text-blue-600 hover:bg-white/90"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
