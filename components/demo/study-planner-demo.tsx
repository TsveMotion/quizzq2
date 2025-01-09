'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const subjects = [
  { id: 'math', name: 'Mathematics - GCSE', defaultHours: 4 },
  { id: 'english', name: 'English Language - GCSE', defaultHours: 4 },
  { id: 'science', name: 'Combined Science - GCSE', defaultHours: 6 },
  { id: 'geography', name: 'Geography - GCSE', defaultHours: 3 },
];

export function StudyPlannerDemo() {
  const [examDate, setExamDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate plan generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    // Here you would typically show the generated plan
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-[#4169E1]" />
        <span className="text-lg font-semibold text-white">Study Planner</span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">
            Create Your Study Plan
          </h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-white/90">Exam Date</Label>
              <Input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#151d3b] text-white/90 rounded-lg p-3 border border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Subjects</Label>
              <div className="grid gap-2">
                {subjects.map((subject) => (
                  <label key={subject.id} className="flex items-center gap-2 text-white/90">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubjects([...selectedSubjects, subject.id]);
                        } else {
                          setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                        }
                      }}
                      className="rounded border-white/20"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span>{subject.name}</span>
                      <span className="text-white/50">~{subject.defaultHours} hours/week</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Study Hours per Week</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="flex-1"
                />
                <span className="text-white/90 min-w-[80px] text-center">
                  {hoursPerWeek} hours
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !examDate || selectedSubjects.length === 0}
            className="w-full bg-[#4169E1] hover:bg-[#4169E1]/90 text-white mt-6 group"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating Plan...
              </div>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Create Study Plan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
