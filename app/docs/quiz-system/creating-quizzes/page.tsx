'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CreatingQuizzesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creating Quizzes</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn how to create effective quizzes in QUIZZQ
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        <h2>Quiz Creation Process</h2>
        <p>
          Creating a quiz in QUIZZQ is straightforward and flexible. Follow these steps to create
          engaging quizzes for your students.
        </p>

        <div className="not-prose mb-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 1: Basic Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside text-sm">
                  <li>Name your quiz</li>
                  <li>Set time limit</li>
                  <li>Choose subject/topic</li>
                  <li>Add description</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 2: Add Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside text-sm">
                  <li>Select question type</li>
                  <li>Enter question content</li>
                  <li>Add answer options</li>
                  <li>Set correct answers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 3: Configure Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside text-sm">
                  <li>Set passing score</li>
                  <li>Choose display options</li>
                  <li>Configure attempts allowed</li>
                  <li>Set availability window</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 4: Review & Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside text-sm">
                  <li>Preview quiz</li>
                  <li>Check all questions</li>
                  <li>Verify settings</li>
                  <li>Publish or save draft</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <h2>Question Types</h2>
        <div className="not-prose mb-8">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Multiple Choice</CardTitle>
                  <Badge>Basic</Badge>
                </div>
                <CardDescription>
                  Students select one correct answer from multiple options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for: Testing specific knowledge, vocabulary, or concepts with clear right/wrong answers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Multiple Answer</CardTitle>
                  <Badge>Intermediate</Badge>
                </div>
                <CardDescription>
                  Students select all applicable correct answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for: Complex topics where multiple factors or elements are correct
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>True/False</CardTitle>
                  <Badge>Basic</Badge>
                </div>
                <CardDescription>
                  Students determine if a statement is true or false
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for: Quick fact checking and basic understanding
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Short Answer</CardTitle>
                  <Badge>Advanced</Badge>
                </div>
                <CardDescription>
                  Students provide a brief written response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Best for: Testing deeper understanding and explanation abilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <h2>Best Practices</h2>
        <ul>
          <li>Keep questions clear and concise</li>
          <li>Use a mix of question types</li>
          <li>Include detailed feedback for wrong answers</li>
          <li>Structure questions from easy to difficult</li>
          <li>Preview the quiz from a student&apos;s perspective</li>
          <li>Use images and diagrams when helpful</li>
        </ul>

        <h2>Quiz Settings</h2>
        <h3>Time Management</h3>
        <ul>
          <li>Set appropriate time limits</li>
          <li>Consider question complexity</li>
          <li>Allow buffer time for reading</li>
        </ul>

        <h3>Attempts</h3>
        <ul>
          <li>Single attempt for assessments</li>
          <li>Multiple attempts for practice</li>
          <li>Configure attempt penalties</li>
        </ul>

        <h3>Display Options</h3>
        <ul>
          <li>Randomize question order</li>
          <li>Show/hide correct answers</li>
          <li>Display progress indicators</li>
        </ul>

        <div className="not-prose">
          <div className="bg-muted rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Related Guides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/docs/quiz-system/question-types" className="text-primary hover:underline">
                  Detailed Question Types Guide →
                </a>
              </li>
              <li>
                <a href="/docs/quiz-system/grading-system" className="text-primary hover:underline">
                  Understanding the Grading System →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
