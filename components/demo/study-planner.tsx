'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Loader2, BookOpen, ListChecks, GraduationCap } from "lucide-react";

const subjects = [
  { id: "mathematics", label: "Mathematics - GCSE", hours: "~4 hours/week" },
  { id: "english", label: "English Language - GCSE", hours: "~4 hours/week" },
  { id: "science", label: "Combined Science - GCSE", hours: "~6 hours/week" },
  { id: "geography", label: "Geography - GCSE", hours: "~3 hours/week" }
];

export function StudyPlannerDemo() {
  const [examDate, setExamDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [studyHours, setStudyHours] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleGenerate = async () => {
    if (!examDate || selectedSubjects.length === 0) {
      return;
    }

    setGenerating(true);
    
    try {
      const response = await fetch('/api/demo/generate-study-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examDate,
          subjects: selectedSubjects,
          studyHours
        }),
      });

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 pb-6 border-b border-purple-200/20"
      >
        <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Create Your Study Plan</h2>
          <p className="text-purple-200/60">Customize your study schedule based on your goals</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Exam Date */}
        <div className="space-y-2">
          <Label className="text-purple-100">Exam Date</Label>
          <div className="relative">
            <Input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-white/5 border-purple-300/20 text-purple-100 focus:border-purple-400 focus:ring-purple-400/20"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-purple-400" />
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-4">
          <Label className="text-purple-100">Subjects</Label>
          <div className="grid gap-3">
            <AnimatePresence>
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      selectedSubjects.includes(subject.id)
                        ? 'bg-purple-500/20 border-purple-400/50'
                        : 'bg-white/5 border-purple-300/20 hover:border-purple-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => handleSubjectToggle(subject.id)}
                        className="border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div>
                        <p className="font-medium text-purple-100">{subject.label}</p>
                        <p className="text-sm text-purple-300/60">{subject.hours}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Study Hours Slider */}
        <div className="space-y-2">
          <Label className="text-purple-100">Study Hours per Week</Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="40"
              value={studyHours}
              onChange={(e) => setStudyHours(parseInt(e.target.value))}
              className="flex-1 h-2 bg-purple-200/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-purple-100 font-medium min-w-[4rem]">{studyHours} hours</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generating || !examDate || selectedSubjects.length === 0}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <ListChecks className="mr-2 h-4 w-4" />
              Create Study Plan
            </>
          )}
        </Button>
      </motion.div>

      {/* Study Plan Output */}
      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 space-y-8"
          >
            {/* Weekly Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Weekly Schedule</h3>
              <div className="grid gap-4">
                {plan.weeklySchedule?.map((day: any, dayIndex: number) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                  >
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-300/20">
                      <h4 className="font-medium text-purple-100 mb-3">{day.day}</h4>
                      <div className="space-y-3">
                        {day.sessions?.map((session: any, sessionIndex: number) => (
                          <div
                            key={sessionIndex}
                            className="p-3 rounded-lg bg-purple-500/10 border border-purple-400/20"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-purple-100">{session.subject}</span>
                              <span className="text-sm text-purple-300">{session.duration}</span>
                            </div>
                            <p className="text-sm text-purple-200/80 mb-2">{session.focus}</p>
                            <ul className="space-y-1">
                              {session.activities?.map((activity: string, index: number) => (
                                <li key={index} className="text-sm text-purple-300/60 flex items-center gap-2">
                                  <span className="h-1 w-1 rounded-full bg-purple-400" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Study Recommendations</h3>
              <div className="grid gap-4">
                {plan.recommendations?.map((rec: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-purple-300/20"
                  >
                    <h4 className="font-medium text-purple-100 mb-3">{rec.subject}</h4>
                    
                    {/* Tips */}
                    <div className="space-y-2 mb-4">
                      <h5 className="text-sm font-medium text-purple-200">Study Tips</h5>
                      <ul className="space-y-2">
                        {rec.tips?.map((tip: string, tipIndex: number) => (
                          <li key={tipIndex} className="text-sm text-purple-300/60 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-purple-200">Recommended Resources</h5>
                      <ul className="space-y-2">
                        {rec.resources?.map((resource: string, resIndex: number) => (
                          <li key={resIndex} className="text-sm text-purple-300/60 flex items-center gap-2">
                            <ListChecks className="h-4 w-4 text-purple-400" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Study Milestones</h3>
              <div className="space-y-4">
                {plan.milestones?.map((milestone: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-purple-300/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <span className="font-medium text-purple-100">{milestone.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {milestone.goals?.map((goal: string, goalIndex: number) => (
                        <li key={goalIndex} className="text-sm text-purple-300/60 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
