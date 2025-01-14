import React from 'react';

interface UserLearningGoalsTabProps {
  // Add props as needed
}

export const UserLearningGoalsTab: React.FC<UserLearningGoalsTabProps> = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Learning Goals</h2>
      {/* Add your learning goals content here */}
    </div>
  );
};

export default UserLearningGoalsTab;
