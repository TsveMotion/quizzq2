'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/user`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful! Upgrading your account...");
      // Refresh the page after a short delay to show updated UI
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <PaymentElement className="!bg-transparent" />
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </Button>
      {message && (
        <div className={`text-sm text-center ${
          message.includes("successful") ? "text-green-400" : "text-red-400"
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}
