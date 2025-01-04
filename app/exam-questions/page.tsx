'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Filter, Search, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedQuestionCard } from "@/components/animated-question-card";
import { sampleQuestions } from "@/data/sample-questions";
import { useState } from "react";
import { Difficulty, Question, Subject } from "@/types/question";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function ExamQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");

  const filteredQuestions = sampleQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Practice Exam Questions
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Enhance your knowledge with our curated collection of exam questions
            </motion.p>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 p-6 rounded-lg bg-accent/5">
            <Brain className="w-10 h-10 text-primary" />
            <div>
              <h3 className="font-semibold">AI-Generated</h3>
              <p className="text-sm text-muted-foreground">Unique questions tailored to your level</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 p-6 rounded-lg bg-accent/5">
            <Target className="w-10 h-10 text-primary" />
            <div>
              <h3 className="font-semibold">Exam-Focused</h3>
              <p className="text-sm text-muted-foreground">Questions aligned with exam standards</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 p-6 rounded-lg bg-accent/5">
            <Sparkles className="w-10 h-10 text-primary" />
            <div>
              <h3 className="font-semibold">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">Detailed explanations and solutions</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              className="pl-10" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as Subject | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Questions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredQuestions.map((q) => (
            <motion.div key={q.id} variants={itemVariants}>
              <AnimatedQuestionCard question={q} />
            </motion.div>
          ))}

          {filteredQuestions.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="col-span-2 text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No questions found matching your criteria. Try adjusting your filters.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <Button size="lg" variant="outline">
              Load More Questions
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
