'use client';

import * as React from 'react';
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
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
      "1,000 AI prompts per month",
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
    name: "Forever Plan",
    description: "Lifetime access to premium features",
    price: "£69.99",
    period: "one-time",
    features: [
      "All Pro features",
      "10,000 AI prompts",
      "Lifetime access",
      "No monthly fees",
      "Priority support",
      "Early access to new features",
      "Exclusive study resources",
      "Custom learning paths",
      "Advanced AI tools",
    ],
    buttonText: "Get Lifetime Access",
    buttonLink: "/register?type=forever",
    popular: false,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

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
    <div className="min-h-screen bg-[#1a237e]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#311b92] opacity-100" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container relative mx-auto px-4 py-24"
          >
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md shadow-lg"
              >
                <span className="flex items-center text-sm font-medium text-white">
                  <Sparkles className="mr-2 inline-block h-4 w-4 animate-pulse text-blue-200" />
                  Simple, Transparent Pricing
                </span>
              </motion.div>

              <motion.h1 
                className="mb-6 font-bold text-white md:text-6xl text-4xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Choose Your Perfect{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 animate-glow bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    Plan
                  </span>
                  <span className="absolute -inset-x-4 -inset-y-2 z-0 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40 blur-xl" />
                </span>
              </motion.h1>

              <motion.p 
                className="mb-8 text-xl text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                From individual learning to complete school management solutions, 
                we have a plan that's right for you.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#1a237e] to-[#283593]">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={itemVariants}>
                <Card 
                  className={`relative overflow-hidden bg-white/10 border-white/20 backdrop-blur-lg h-full grid grid-rows-[auto_1fr_auto] ${
                    plan.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <CardHeader className="flex flex-col gap-2">
                    {plan.popular && (
                      <div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-fit">
                        Most Popular
                      </div>
                    )}
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-white/70">{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-white/70 ml-2">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-white text-blue-600 hover:bg-white/90' 
                          : 'border-white/40 text-white hover:bg-white/10'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handlePlanSelection(plan)}
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 bg-[#311b92]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Contact our sales team to discuss your specific requirements and get a tailored solution for your institution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90"
                onClick={() => router.push('/contact?type=sales')}
              >
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => router.push('/demo')}
              >
                Schedule Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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
