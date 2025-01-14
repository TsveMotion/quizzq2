import { SuperAdminLayout } from "@/components/dashboard/SuperAdmin-Tabs/superadmin-layout";
import { DatabaseManagement } from "@/components/dashboard/SuperAdmin-Tabs/database-management";

export default function DatabasePage() {
  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-[#1a237e]">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">Database Management</h2>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8">
            <DatabaseManagement />
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
