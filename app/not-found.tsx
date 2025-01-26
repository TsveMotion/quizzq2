'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      <div 
        className="text-center space-y-12 animate-in zoom-in-50 slide-in-from-bottom-8 duration-700 w-full"
      >
        <div className="space-y-8">
          <div className="relative inline-block">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
              404
            </h1>
            <p className="text-3xl font-semibold text-muted-foreground mt-4">
              Page Not Found
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xl text-muted-foreground">
              The page you're looking for doesn't exist or is still under development
            </p>
            <p className="text-sm text-muted-foreground/80">
              We're continuously expanding our platform with new features
            </p>
          </div>
        </div>

        <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-200">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            QuizzQ is currently in active development. New features and improvements are being added regularly.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-6">
          <Link href="/" passHref>
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Need assistance?{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
