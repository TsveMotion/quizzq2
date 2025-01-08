'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get('payment_intent');
  const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    // Verify the payment was successful
    if (payment_intent && payment_intent_client_secret) {
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntent: payment_intent,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Payment verified, redirect to signup after a short delay
            setTimeout(() => {
              router.push('/signup?plan=pro');
            }, 2000);
          }
        })
        .catch(console.error);
    }
  }, [payment_intent, payment_intent_client_secret, router]);

  return (
    <div className="container max-w-lg mx-auto py-16 px-4 text-center">
      <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-green-500" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for subscribing to QUIZZQ Pro. You'll be redirected to complete your account setup.
      </p>
      <Button 
        onClick={() => router.push('/signup?plan=pro')}
        className="w-full max-w-sm"
      >
        Continue to Setup
      </Button>
    </div>
  );
}
