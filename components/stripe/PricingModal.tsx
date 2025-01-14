'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleStartCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setShowCheckout(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-[#020817] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Upgrade Your Learning Experience
          </DialogTitle>
        </DialogHeader>
        {!showCheckout ? (
          <div className="mt-6">
            <Card className="p-6 bg-[#1a1b1e]/50 border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Student Pro</h3>
              <p className="text-white/70 mb-4">Enhanced learning with AI assistance</p>
              <div className="text-3xl font-bold text-white mb-6">
                £3.99 <span className="text-lg font-normal text-white/70">per month</span>
              </div>
              <div className="space-y-3 mb-6">
                <Feature text="All Free features" />
                <Feature text="1,000 AI prompts per month" />
                <Feature text="AI Learning Assistant" />
                <Feature text="Personalized study paths" />
                <Feature text="Advanced analytics" />
                <Feature text="Study pattern insights" />
                <Feature text="Practice question generator" />
                <Feature text="Priority support" />
                <Feature text="Exam preparation tools" />
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleStartCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start Free Trial'}
              </Button>
            </Card>
          </div>
        ) : (
          <div className="mt-6 bg-[#1a1b1e]/50 p-6 rounded-lg border border-white/10">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#9333ea',
                    colorBackground: '#1a1b1e',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  },
                },
              }}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-400" />
      <span className="text-white/90">{text}</span>
    </div>
  );
}
