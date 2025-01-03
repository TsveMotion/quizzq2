'use client';

export default function StudentDashboard({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name || 'Student'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Your Classes</h3>
            <p className="text-gray-600">View and join your enrolled classes.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Assignments</h3>
            <p className="text-gray-600">Check your pending assignments and deadlines.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Progress Report</h3>
            <p className="text-gray-600">Track your academic performance.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Study Resources</h3>
            <p className="text-gray-600">Access study materials and resources.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
