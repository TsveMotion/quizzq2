'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Sample quiz data
const sampleQuizzes = {
  math: {
    title: "Algebra Practice Quiz",
    questions: [
      {
        id: 1,
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 6", "x = 8", "x = 9"],
        correctAnswer: 0,
        explanation: "To solve for x, subtract 5 from both sides: 2x = 8, then divide both sides by 2: x = 4"
      },
      {
        id: 2,
        question: "What is the value of y in the equation y = 3x + 2 when x = 3?",
        options: ["y = 8", "y = 11", "y = 12", "y = 15"],
        correctAnswer: 1,
        explanation: "Substitute x = 3 into the equation: y = 3(3) + 2 = 9 + 2 = 11"
      },
      {
        id: 3,
        question: "Simplify: (2x + 3)(x - 1)",
        options: ["2x² - 2x + 3", "2x² - x - 3", "2x² + x - 3", "2x² - 2x + 3x - 3"],
        correctAnswer: 2,
        explanation: "Use FOIL method: (2x)(x) + (2x)(-1) + (3)(x) + (3)(-1) = 2x² - 2x + 3x - 3 = 2x² + x - 3"
      }
    ]
  },
  science: {
    title: "Biology Practice Quiz",
    questions: [
      {
        id: 1,
        question: "What is the primary function of mitochondria in a cell?",
        options: [
          "Protein synthesis",
          "Energy production",
          "Waste removal",
          "Cell division"
        ],
        correctAnswer: 1,
        explanation: "Mitochondria are known as the powerhouse of the cell because they produce energy in the form of ATP through cellular respiration."
      },
      {
        id: 2,
        question: "Which of the following is NOT a function of the cell membrane?",
        options: [
          "Selective permeability",
          "Energy production",
          "Protection",
          "Cell recognition"
        ],
        correctAnswer: 1,
        explanation: "Energy production is primarily the function of mitochondria, not the cell membrane."
      },
      {
        id: 3,
        question: "What is the process by which plants convert light energy into chemical energy?",
        options: [
          "Cellular respiration",
          "Fermentation",
          "Photosynthesis",
          "Oxidation"
        ],
        correctAnswer: 2,
        explanation: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen."
      }
    ]
  }
};

type QuizType = 'math' | 'science';

export function DemoQuiz({ type }: { type: QuizType }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const quiz = sampleQuizzes[type];
  const question = quiz.questions[currentQuestion];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-lg mb-4">
            You scored {score} out of {quiz.questions.length}
          </p>
          <Button onClick={handleRestart}>Try Again</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4",
                  showExplanation && index === question.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-950",
                  showExplanation && selectedAnswer === index && index !== question.correctAnswer && "border-red-500 bg-red-50 dark:bg-red-950"
                )}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showExplanation ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
            <Button onClick={handleNext} className="w-full">
              {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className="w-full"
          >
            Check Answer
          </Button>
        )}
      </div>
    </Card>
  );
}
