'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Timer, HelpCircle, BookOpen, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";

const FREE_QUIZZES = [
  {
    id: 1,
    title: "Basic Mathematics",
    description: "Practice fundamental math concepts",
    questions: 10,
    timeLimit: "15 minutes",
    available: true,
    category: "Mathematics",
  },
  {
    id: 2,
    title: "English Grammar",
    description: "Test your grammar knowledge",
    questions: 15,
    timeLimit: "20 minutes",
    available: true,
    category: "English",
  },
  {
    id: 3,
    title: "General Knowledge",
    description: "Test your general knowledge",
    questions: 12,
    timeLimit: "18 minutes",
    available: true,
    category: "General",
  },
  {
    id: 4,
    title: "Advanced Mathematics",
    description: "Challenge yourself with advanced math problems",
    questions: 20,
    timeLimit: "30 minutes",
    available: false,
    category: "Mathematics",
  },
];

export function FreeQuizzesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search quizzes..."
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FREE_QUIZZES.map((quiz) => (
          <Card key={quiz.id} className={quiz.available ? "" : "opacity-75"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quiz.category}</p>
                  </div>
                </div>
                {!quiz.available && (
                  <div className="flex items-center text-muted-foreground">
                    <Crown className="h-4 w-4 mr-1" />
                    <span className="text-xs">Pro</span>
                  </div>
                )}
              </div>
              <CardDescription className="mt-2">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>{quiz.questions} Questions</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Timer className="h-4 w-4 mr-2" />
                    <span>{quiz.timeLimit}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant={quiz.available ? "default" : "secondary"}
                  disabled={!quiz.available}
                >
                  {quiz.available ? (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Quiz
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pro Only
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
