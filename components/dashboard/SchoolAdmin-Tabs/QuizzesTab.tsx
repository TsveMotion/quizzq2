'use client';

import React from 'react';

export interface QuizzesTabProps {
  schoolId: string;
}

export const QuizzesTab: React.FC<QuizzesTabProps> = ({ schoolId }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
      {/* Add quizzes content here */}
    </div>
  );
};
