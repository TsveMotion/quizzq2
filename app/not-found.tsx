import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div 
        className="text-center space-y-8 animate-in fade-in-50 duration-500"
      >
        <h1 className="text-4xl font-bold text-primary">
          Oops! 
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Kristiyan - QuizzQ has not made this page yet
        </p>
        <Link href="/" passHref>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
