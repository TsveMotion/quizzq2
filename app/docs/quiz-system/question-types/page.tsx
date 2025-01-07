'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ListChecks,
  AlignLeft,
  CheckSquare,
  FileText,
  SplitSquareHorizontal,
  FileQuestion,
  Code,
  ImagePlus,
  ArrowLeftRight,
  FileCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BaseExample {
  question: string;
}

interface MultipleChoiceExample extends BaseExample {
  options: string[];
  correct: string;
}

interface ShortAnswerExample extends BaseExample {
  answer: string;
}

interface TrueFalseExample extends BaseExample {
  answer: string;
}

interface EssayExample extends BaseExample {
  guidelines: string;
}

interface MatchingExample extends BaseExample {
  pairs: [string, string][];
}

interface CodeExample extends BaseExample {
  language: string;
}

type QuestionExample = MultipleChoiceExample | ShortAnswerExample | TrueFalseExample | EssayExample | MatchingExample | CodeExample;

interface QuestionType {
  title: string;
  description: string;
  icon: any;
  color: string;
  example: QuestionExample;
  features: string[];
}

const questionTypes: QuestionType[] = [
  {
    title: "Multiple Choice",
    description: "Single correct answer from multiple options",
    icon: ListChecks,
    color: "text-blue-500",
    example: {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: "Paris",
    },
    features: [
      "Automatic grading",
      "Randomize option order",
      "Include 'None of the above' option",
      "Support for image options",
    ],
  },
  {
    title: "Short Answer",
    description: "Brief text response to a question",
    icon: AlignLeft,
    color: "text-green-500",
    example: {
      question: "Name the largest planet in our solar system.",
      answer: "Jupiter",
    },
    features: [
      "Case-insensitive matching",
      "Multiple correct answers",
      "Partial credit options",
      "Character limit setting",
    ],
  },
  {
    title: "True/False",
    description: "Binary choice questions",
    icon: CheckSquare,
    color: "text-purple-500",
    example: {
      question: "The Earth is flat.",
      answer: "False",
    },
    features: [
      "Simple format",
      "Quick to create",
      "Automatic grading",
      "Good for basic comprehension",
    ],
  },
  {
    title: "Essay",
    description: "Long-form written responses",
    icon: FileText,
    color: "text-orange-500",
    example: {
      question: "Explain the process of photosynthesis.",
      guidelines: "Include key components and chemical reactions.",
    },
    features: [
      "Rich text editor",
      "Word count limits",
      "Rubric-based grading",
      "File attachments",
    ],
  },
  {
    title: "Matching",
    description: "Match items from two columns",
    icon: ArrowLeftRight,
    color: "text-pink-500",
    example: {
      question: "Match the country with its capital",
      pairs: [
        ["France", "Paris"],
        ["Germany", "Berlin"],
      ],
    },
    features: [
      "Drag and drop interface",
      "Multiple correct matches",
      "Image matching support",
      "Automatic grading",
    ],
  },
  {
    title: "Code",
    description: "Programming questions with execution",
    icon: Code,
    color: "text-yellow-500",
    example: {
      question: "Write a function to calculate factorial",
      language: "Python",
    },
    features: [
      "Syntax highlighting",
      "Multiple language support",
      "Test case validation",
      "Code execution sandbox",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function isMultipleChoiceExample(example: QuestionExample): example is MultipleChoiceExample {
  return 'options' in example;
}

function isMatchingExample(example: QuestionExample): example is MatchingExample {
  return 'pairs' in example;
}

export default function QuestionTypesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <FileQuestion className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Question Types</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Explore the different types of questions available in QUIZZQ
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {questionTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div key={type.title} variants={item}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${type.color}`} />
                    <CardTitle>{type.title}</CardTitle>
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Example</h3>
                    <Card className="bg-muted">
                      <CardContent className="pt-4">
                        {'question' in type.example && (
                          <div className="space-y-2">
                            <p className="font-medium">Q: {type.example.question}</p>
                            {'options' in type.example && isMultipleChoiceExample(type.example) && (
                              <ul className="space-y-1 ml-4">
                                {type.example.options.map((option, index) => (
                                  <li key={index}>
                                    {String.fromCharCode(65 + index)}. {option}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {'answer' in type.example && (
                              <p className="text-muted-foreground">
                                Answer: {type.example.answer}
                              </p>
                            )}
                            {'pairs' in type.example && isMatchingExample(type.example) && (
                              <div className="grid grid-cols-2 gap-2">
                                {type.example.pairs.map(([left, right], index) => (
                                  <React.Fragment key={index}>
                                    <div>{left}</div>
                                    <div>{right}</div>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                            {'guidelines' in type.example && (
                              <p className="text-muted-foreground">
                                Guidelines: {type.example.guidelines}
                              </p>
                            )}
                            {'language' in type.example && (
                              <p className="text-muted-foreground">
                                Language: {type.example.language}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-muted p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Mix different question types to maintain engagement</li>
          <li>• Use clear and concise language in questions</li>
          <li>• Provide detailed instructions for complex question types</li>
          <li>• Test questions before assigning to students</li>
        </ul>
      </motion.div>
    </div>
  );
}
