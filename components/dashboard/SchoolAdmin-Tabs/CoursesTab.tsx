'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen, Users, Clock } from "lucide-react";

export function CoursesTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-50">Courses</h2>
          <p className="text-blue-200">Manage your school's courses and subjects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
        <Input 
          placeholder="Search courses..."
          className="pl-10 bg-blue-800/20 border-blue-800/40 text-blue-50 placeholder:text-blue-400"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Mathematics", teacher: "Dr. Smith", students: 32, duration: "1 Year" },
          { name: "Physics", teacher: "Prof. Johnson", students: 28, duration: "1 Year" },
          { name: "Chemistry", teacher: "Dr. Williams", students: 25, duration: "1 Year" },
          { name: "Biology", teacher: "Mrs. Davis", students: 30, duration: "1 Year" },
          { name: "Computer Science", teacher: "Mr. Wilson", students: 22, duration: "1 Year" },
          { name: "English Literature", teacher: "Ms. Brown", students: 35, duration: "1 Year" },
        ].map((course, index) => (
          <Card 
            key={index}
            className="p-6 bg-blue-800/20 border-blue-800/40 hover:bg-blue-800/30 transition-colors cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-50">{course.name}</h3>
                  <p className="text-sm text-blue-200">{course.teacher}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-200">{course.students} Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-200">{course.duration}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
