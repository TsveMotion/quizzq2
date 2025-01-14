import { SuperAdminLayout } from "@/components/dashboard/SuperAdmin-Tabs/superadmin-layout";
import { SecuritySettings } from "@/components/dashboard/SuperAdmin-Tabs/security-settings";

export default function SecurityPage() {
  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-[#1a237e]">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">Security Settings</h2>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8">
            <SecuritySettings />
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
