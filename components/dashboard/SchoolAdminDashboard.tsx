'use client';

export default function SchoolAdminDashboard({ user }: { user: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">School Administrator Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name || 'Admin'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">User Management</h3>
            <p className="text-gray-600">Manage teachers and students accounts.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Class Management</h3>
            <p className="text-gray-600">Oversee and organize classes.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">School Analytics</h3>
            <p className="text-gray-600">View school-wide performance metrics.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Resource Allocation</h3>
            <p className="text-gray-600">Manage and distribute resources.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Reports</h3>
            <p className="text-gray-600">Generate and view school reports.</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Settings</h3>
            <p className="text-gray-600">Configure school-wide settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
