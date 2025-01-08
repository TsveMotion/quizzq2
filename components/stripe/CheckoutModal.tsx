'use client';

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update: updateSession, data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting payment submission...');

    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized');
      setError("Payment system is not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Submitting payment element...');
      // First validate the payment element
      const { error: validationError } = await elements.submit();
      if (validationError) {
        console.error('Validation error:', validationError);
        throw new Error(validationError.message);
      }

      console.log('Payment element validated, confirming payment...');
      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/User?success=true`,
          payment_method_data: {
            billing_details: {
              name: session?.user?.name || 'Unknown User',
              email: session?.user?.email || '',
              phone: null,
              address: {
                country: 'GB',
                postal_code: null,
                line1: null,
                line2: null,
                city: null,
                state: null
              }
            },
          },
        },
        redirect: 'if_required',
      });

      console.log('Payment confirmation result:', { confirmError, paymentIntent });

      if (confirmError) {
        console.error('Stripe error details:', {
          type: confirmError.type,
          message: confirmError.message,
          code: confirmError.code,
          decline_code: confirmError.decline_code,
        });
        
        // Handle specific error types
        if (confirmError.type === 'card_error' || confirmError.type === 'validation_error') {
          throw new Error(confirmError.message || 'Card validation failed. Please check your card details.');
        } else {
          throw new Error('Payment processing failed. Please try again or use a different payment method.');
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, updating premium status...');
        try {
          // Update premium status
          const response = await fetch('/api/update-premium-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to update premium status');
          }

          console.log('Premium status updated successfully:', data);

          // Update session with new user data
          await updateSession();
          console.log('Session updated with new premium status');
          
          // Call onSuccess callback
          onSuccess?.();

          // Redirect to dashboard with success message
          router.push('/dashboard/User?success=true');
        } catch (updateError) {
          console.error('Error updating premium status:', updateError);
          throw new Error('Payment successful but failed to activate premium features. Please contact support.');
        }
      } else if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
        throw new Error('Your payment was not successful. Please try another payment method.');
      }

    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Premium Plan Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Premium Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get access to all premium features
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">£3.99</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Features List */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <h4 className="font-medium text-lg">Features included:</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <span className="text-purple-500">✓</span> AI Tutor Access
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="text-purple-500">✓</span> Progress Tracking
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="text-purple-500">✓</span> Advanced Analytics
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="text-purple-500">✓</span> Priority Support
            </li>
          </ul>
        </div>

        {/* Payment Form */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount: £3.99</p>
            </div>
            <PaymentElement options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  name: session?.user?.name || '',
                }
              },
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'never',
                  phone: 'never',
                  address: 'never'
                }
              },
              paymentMethodOrder: ['card'],
              business: {
                name: 'QuizzQ Premium'
              },
              terms: {
                card: 'never'
              }
            }} />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
        disabled={loading || !stripe || !elements}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay £3.99/month"
        )}
      </Button>
    </form>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 399, // £3.99 in pence
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching client secret:", data.error);
            setError(data.error);
            return;
          }
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          console.error("Failed to fetch client secret:", err);
          setError("Failed to initialize payment. Please try again.");
        });
    } else {
      setClientSecret(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade to Premium</DialogTitle>
        </DialogHeader>
        {error ? (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
            {error}
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#9333ea',
                  colorBackground: '#ffffff',
                  colorText: '#1a1a1a',
                  colorDanger: '#df1b41',
                  fontFamily: 'system-ui, sans-serif',
                  spacingUnit: '6px',
                  borderRadius: '8px',
                },
              },
              loader: 'auto',
            }}
          >
            <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} />
          </Elements>
        ) : (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
