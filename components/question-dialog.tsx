import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/question";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function QuestionDialog({
  question,
  open,
  onOpenChange,
}: {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsCorrect(selectedAnswer === question.correctAnswer);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(handleReset, 300); // Reset after dialog closes
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{question.subject}</Badge>
            <Badge 
              className={cn(
                question.difficulty === 'Easy' && "bg-green-500/10 text-green-500",
                question.difficulty === 'Medium' && "bg-yellow-500/10 text-yellow-500",
                question.difficulty === 'Hard' && "bg-red-500/10 text-red-500"
              )}
            >
              {question.difficulty}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{question.question}</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-auto p-4 whitespace-normal",
                    selectedAnswer === index && "border-primary",
                    showExplanation && index === question.correctAnswer && "border-green-500 bg-green-500/10",
                    showExplanation && selectedAnswer === index && index !== question.correctAnswer && "border-red-500 bg-red-500/10"
                  )}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                >
                  {answer}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Result and Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className={cn(
                  "p-4 rounded-lg flex items-center gap-2",
                  isCorrect ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Correct! Well done!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Not quite right. Let's learn from this!</span>
                    </>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <p className="text-muted-foreground">{question.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {!showExplanation ? (
              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleReset}>Try Another Question</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
