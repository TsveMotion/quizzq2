import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { Question } from "@/types/question";
import { useState } from "react";
import { QuestionDialog } from "./question-dialog";
import { cn } from "@/lib/utils";

interface AnimatedQuestionCardProps {
  question: Question;
}

export function AnimatedQuestionCard({ question }: AnimatedQuestionCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
  }[question.difficulty];

  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        viewport={{ once: true }}
      >
        <Card className="p-6 relative overflow-hidden cursor-pointer" onClick={() => setDialogOpen(true)}>
          {/* Background decoration */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full" />
          <div className="absolute top-4 right-4 w-16 h-16 bg-accent/5 rounded-full" />
          
          {/* Content */}
          <div className="relative">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{question.subject}</Badge>
              <Badge className={difficultyColor}>{question.difficulty}</Badge>
              {question.isAIGenerated && (
                <Badge variant="outline" className="gap-1">
                  <Star className="w-3 h-3" />
                  AI Generated
                </Badge>
              )}
            </div>

            {/* Question */}
            <p className="text-lg font-medium mb-6">{question.question}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{question.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Verified</span>
                </div>
              </div>
              <Button>Start Question</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <QuestionDialog 
        question={question}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
