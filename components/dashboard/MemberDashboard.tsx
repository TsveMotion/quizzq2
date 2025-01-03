'use client';

export default function MemberDashboard({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name || 'Member'}</h2>
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Available Quizzes</h3>
            <p className="text-gray-600">Start exploring our quizzes to test your knowledge!</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Your Progress</h3>
            <p className="text-gray-600">Track your learning journey here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
