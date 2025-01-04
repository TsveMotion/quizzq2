'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, GraduationCap, MessageSquareMore, Sparkles } from "lucide-react";
import Link from "next/link";
import { DemoQuiz } from "@/components/demo/DemoQuiz";
import { DemoAIHelper } from "@/components/demo/DemoAIHelper";
import { useState } from "react";

export default function DemoPage() {
  const [activeQuiz, setActiveQuiz] = useState<'math' | 'science' | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Try QUIZZQ for Free
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the power of AI-driven learning with our interactive demo.
            No sign-up required!
          </p>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="quiz" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
              <TabsTrigger value="ai">AI Study Helper</TabsTrigger>
              <TabsTrigger value="features">Key Features</TabsTrigger>
            </TabsList>

            {/* Practice Quiz Demo */}
            <TabsContent value="quiz" className="mt-6">
              {!activeQuiz ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Try a Practice Quiz</CardTitle>
                    <CardDescription>
                      Experience our adaptive quiz system with instant feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2">Sample Math Quiz</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Test your algebra skills with our AI-generated questions
                          </p>
                          <Button onClick={() => setActiveQuiz('math')}>Start Quiz</Button>
                        </Card>
                        <Card className="p-4">
                          <h3 className="font-semibold mb-2">Science Quiz</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Explore biology concepts with interactive questions
                          </p>
                          <Button onClick={() => setActiveQuiz('science')}>Start Quiz</Button>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveQuiz(null)}
                    className="mb-4"
                  >
                    ← Back to Quiz Selection
                  </Button>
                  <DemoQuiz type={activeQuiz} />
                </div>
              )}
            </TabsContent>

            {/* AI Helper Demo */}
            <TabsContent value="ai" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Study Helper</CardTitle>
                  <CardDescription>
                    Get homework help and study guidance from our AI tutor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DemoAIHelper />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Overview */}
            <TabsContent value="features" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Brain className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>AI-Powered Learning</CardTitle>
                    <CardDescription>
                      Personalized learning paths that adapt to your understanding
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <MessageSquareMore className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>24/7 AI Support</CardTitle>
                    <CardDescription>
                      Get instant help from our AI tutors anytime you need
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Sparkles className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>Smart Assignments</CardTitle>
                    <CardDescription>
                      Auto-graded assignments with detailed explanations
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students already using QUIZZQ to achieve their
            academic goals.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
