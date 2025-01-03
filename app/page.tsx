import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, GraduationCap, MessageSquareMore, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Learning Journey with AI
            </h1>
            <p className="text-xl mb-8">
              Experience personalized education powered by advanced AI technology.
              Take quizzes, get instant feedback, and learn at your own pace.
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10" asChild>
                <Link href="/demo">Try Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose QUIZZQ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-10 h-10" />}
              title="AI-Powered Learning"
              description="Adaptive learning paths that adjust to your understanding and pace"
            />
            <FeatureCard
              icon={<MessageSquareMore className="w-10 h-10" />}
              title="24/7 AI Tutoring"
              description="Get instant help from our AI chatbots whenever you need it"
            />
            <FeatureCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Smart Assignments"
              description="Auto-graded assignments with detailed feedback and explanations"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Join thousands of students already using QUIZZQ to achieve their
            academic goals.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/signup">Start Learning Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}