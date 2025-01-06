import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  School, 
  GraduationCap, 
  FileText, 
  Brain,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";

export const metadata: Metadata = {
  title: "About QUIZZQ",
  description: "Learn about QUIZZQ - The intelligent assignment management platform for schools",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            About QUIZZQ
          </h1>
          <p className="text-xl text-muted-foreground">
            The intelligent assignment management platform designed for modern education
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI-Powered"
            description="Generate engaging assignments automatically with our advanced AI technology"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Role-Based Access"
            description="Tailored interfaces for administrators, teachers, and students"
          />
          <FeatureCard
            icon={<School className="h-8 w-8" />}
            title="School Management"
            description="Comprehensive tools for managing classes, teachers, and students"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="Assignment Tracking"
            description="Create, distribute, and grade assignments with ease"
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            title="Real-Time Updates"
            description="Track submissions and progress in real-time"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Secure Platform"
            description="Built with security and privacy in mind"
          />
        </div>

        {/* Platform Benefits */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Platform Benefits
          </h2>
          <div className="grid gap-4">
            <BenefitRow
              icon={<GraduationCap className="h-5 w-5" />}
              title="For Teachers"
              benefits={[
                "AI-assisted assignment creation",
                "Easy class management",
                "Automated grading tools",
                "Student progress tracking",
                "Real-time submission monitoring"
              ]}
            />
            <BenefitRow
              icon={<BookOpen className="h-5 w-5" />}
              title="For Students"
              benefits={[
                "Clear assignment overview",
                "Easy submission process",
                "Progress tracking",
                "Instant feedback",
                "Organized learning materials"
              ]}
            />
            <BenefitRow
              icon={<School className="h-5 w-5" />}
              title="For Schools"
              benefits={[
                "Centralized management",
                "Performance analytics",
                "Resource optimization",
                "Enhanced communication",
                "Streamlined administration"
              ]}
            />
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Technical Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Next.js 13 App Router</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>NextAuth Authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Prisma ORM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Real-time Updates</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Security Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Role-based Access Control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Secure API Endpoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Data Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Session Management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="text-primary">{icon}</div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitRow({ icon, title, benefits }: {
  icon: React.ReactNode;
  title: string;
  benefits: string[];
}) {
  return (
    <div className="flex gap-4 items-start p-4 rounded-lg border bg-card">
      <div className="text-primary mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold mb-2">{title}</h3>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
