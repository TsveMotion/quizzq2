'use client';

export default function TeacherDashboard({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name || 'Teacher'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Your Classes</h3>
            <p className="text-gray-600">Manage your classes and students.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Create Quiz</h3>
            <p className="text-gray-600">Create new quizzes and assignments.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Grade Assignments</h3>
            <p className="text-gray-600">Review and grade student submissions.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Analytics</h3>
            <p className="text-gray-600">View class performance analytics.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Resources</h3>
            <p className="text-gray-600">Manage teaching resources and materials.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Schedule</h3>
            <p className="text-gray-600">View and manage your teaching schedule.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
