'use client';

import * as React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { PaymentModal } from "@/components/stripe/PaymentModal";
import Link from "next/link";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  popular: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Student Free",
    description: "Perfect for individual students",
    price: "Free",
    features: [
      "Personal account",
      "Basic quiz taking",
      "Progress tracking",
      "Performance analytics",
      "Study materials access",
      "Basic study tools",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonLink: "/register?type=student",
    popular: false,
  },
  {
    name: "Student Pro",
    description: "Enhanced learning with AI assistance",
    price: "£3.99",
    period: "per month",
    features: [
      "All Free features",
      "AI Learning Assistant",
      "Personalized study paths",
      "Advanced analytics",
      "Study pattern insights",
      "Practice question generator",
      "Priority support",
      "Exam preparation tools",
    ],
    buttonText: "Start Free Trial",
    buttonLink: "/register?type=student-pro",
    popular: true,
  },
  {
    name: "School & Institution",
    description: "Complete school management system",
    price: "Custom",
    features: [
      "Full teacher-student management",
      "Administrative dashboard",
      "Bulk user management",
      "Custom branding",
      "Advanced reporting",
      "School analytics",
      "API access",
      "Dedicated support",
    ],
    buttonText: "Contact Sales",
    buttonLink: "/contact",
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = React.useState<PricingPlan | null>(null);

  const handlePlanSelection = (plan: PricingPlan) => {
    if (plan.name === "School & Institution") {
      router.push('/contact?type=school-inquiry');
    } else if (plan.name === "Student Free") {
      router.push('/signup?plan=free');
    } else {
      // For pro plan, show payment modal
      setSelectedPlan(plan);
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/signup?plan=pro');
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Learning Journey</h1>
        <p className="text-xl text-muted-foreground">
          From individual learning to complete school management
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`flex flex-col ${
              plan.popular ? 'border-primary shadow-lg' : ''
            }`}
          >
            <CardHeader>
              {plan.popular && (
                <div className="px-3 py-1 text-sm text-primary-foreground bg-primary rounded-full w-fit mb-2">
                  Most Popular
                </div>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${
                  plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePlanSelection(plan)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Something Different?</h2>
        <p className="text-muted-foreground mb-8">
          Contact us for custom pricing options or to discuss your specific requirements.
        </p>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => router.push('/contact')}
        >
          Contact Sales
        </Button>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
