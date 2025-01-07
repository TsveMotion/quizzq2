'use client';

import React from 'react';

export interface AssignmentsTabProps {
  schoolId: string;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ schoolId }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>
      {/* Add assignments content here */}
    </div>
  );
};
