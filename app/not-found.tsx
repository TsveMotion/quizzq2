import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <div 
        className="text-center space-y-12 animate-in fade-in-50 duration-500 w-full"
      >
        <div className="space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Oops! 
          </h1>
          <div className="space-y-2">
            <p className="text-2xl text-muted-foreground">
              Kristiyan - QuizzQ has not made this page yet
            </p>
            <p className="text-sm text-muted-foreground/80">
              We&apos;re continuously working on new features and improvements
            </p>
          </div>
        </div>

        <Alert className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/50 max-w-lg mx-auto">
          <Construction className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
            QuizzQ is currently in Beta Testing and Development. Some features may be incomplete or under construction.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-4">
          <Link href="/" passHref>
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
            </p>
            <p>
              Or check our{" "}
              <Link href="/docs" className="text-primary hover:underline">
                documentation
              </Link>
              {" "}for more information
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground/60">
          {new Date().getFullYear()} QuizzQ - Beta Version
        </p>
      </div>
    </div>
  );
}
