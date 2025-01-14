'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

export function CalendarTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-50">School Calendar</h2>
          <p className="text-blue-200">View and manage school events</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Week Days */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center py-2 text-blue-200 font-medium">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {Array.from({ length: 35 }, (_, i) => (
          <Card 
            key={i}
            className="p-2 min-h-[100px] bg-blue-800/20 border-blue-800/40"
          >
            <div className="text-sm text-blue-400 mb-2">{i + 1}</div>
            {i === 4 && (
              <div className="p-1.5 bg-blue-600/20 rounded text-xs text-blue-200">
                Parent Meeting
              </div>
            )}
            {i === 10 && (
              <div className="p-1.5 bg-purple-600/20 rounded text-xs text-purple-200">
                Sports Day
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-50 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <Card className="p-4 bg-blue-800/20 border-blue-800/40">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-500/20 rounded">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-50">Parent-Teacher Meeting</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-blue-200">
                    <Clock className="h-4 w-4 mr-2" />
                    Tomorrow, 2:00 PM
                  </div>
                  <div className="flex items-center text-sm text-blue-200">
                    <MapPin className="h-4 w-4 mr-2" />
                    Main Hall
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/20 border-blue-800/40">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-500/20 rounded">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-50">Annual Sports Day</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-blue-200">
                    <Clock className="h-4 w-4 mr-2" />
                    Next Week, Monday
                  </div>
                  <div className="flex items-center text-sm text-blue-200">
                    <MapPin className="h-4 w-4 mr-2" />
                    Sports Ground
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
