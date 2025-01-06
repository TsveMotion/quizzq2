'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SuperAdminOverviewTab } from "./OverviewTab";
import { UsersTab } from "./UsersTab";
import { SchoolsTab } from "./SchoolsTab";
import { ContactsTab } from "./ContactsTab";
import { SettingsTab } from "./SettingsTab";
import SystemSettingsTab from "./SystemSettingsTab"; // Fix SystemSettingsTab import
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  School, 
  MessageSquare,
  LogOut,
  Settings,
  HelpCircle,
  Building2,
  Cog 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    title: "Users",
    value: "users",
    icon: Users,
    disabled: false,
  },
  {
    title: "Schools",
    value: "schools",
    icon: School,
    disabled: false,
  },
  {
    title: "Contact Messages",
    value: "contacts",
    icon: MessageSquare,
    disabled: false,
  },
  {
    title: "System Settings",
    value: "system",
    icon: Cog,
    disabled: false,
  }
];

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    disabled: true,
  },
  {
    title: "Help",
    value: "help",
    icon: HelpCircle,
    disabled: true,
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch users:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setUsers([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/schools', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch schools:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to fetch schools');
      }
      const data = await response.json();
      setSchools(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error in fetchSchools:', error);
      setSchools([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setIsSchoolModalOpen(true);
  };

  const handleSaveSchool = async (school: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(school),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save school');
      }

      await fetchSchools(); // Refresh the schools list
      setIsSchoolModalOpen(false);
    } catch (error) {
      console.error('Failed to save school:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/schools?id=${schoolId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete school');
      }

      await fetchSchools(); // Refresh the schools list
    } catch (error) {
      console.error('Failed to delete school:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSchool = (school: any) => {
    setSelectedSchool(school);
    setIsSchoolModalOpen(true);
  };

  const handleUsersChange = () => {
    fetchUsers();
  };

  const handleSchoolsChange = () => {
    fetchSchools();
  };

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <div className="flex flex-col w-64 border-r bg-background h-full">
        {/* Logo and title */}
        <div className="shrink-0 p-6 border-b">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6" />
            <span className="font-semibold">QUIZZQ Admin</span>
          </div>
        </div>

        {/* Main content wrapper */}
        <div className="flex flex-col flex-1">
          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {/* Main nav items */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    activeTab === item.value && "bg-muted"
                  )}
                  onClick={() => setActiveTab(item.value)}
                  disabled={item.disabled}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Fixed bottom section */}
          <div className="shrink-0 border-t bg-background px-4 py-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => window.open('/docs', '_blank')}
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-8">
          <Tabs value={activeTab} className="space-y-6">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <SuperAdminOverviewTab />
            </TabsContent>
            <TabsContent value="users" className="mt-0 space-y-4">
              <UsersTab
                users={users}
                schools={schools}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onUsersChange={handleUsersChange}
              />
            </TabsContent>
            <TabsContent value="schools" className="mt-0 space-y-4">
              <SchoolsTab
                schools={schools}
                onAddSchool={() => {
                  setSelectedSchool(null);
                  setIsSchoolModalOpen(true);
                }}
                onEditSchool={(school) => {
                  setSelectedSchool(school);
                  setIsSchoolModalOpen(true);
                }}
                onSaveSchool={handleSaveSchool}
                selectedSchool={selectedSchool}
                isSchoolModalOpen={isSchoolModalOpen}
                setIsSchoolModalOpen={setIsSchoolModalOpen}
                isLoading={isLoading}
                onSchoolsChange={handleSchoolsChange}
              />
            </TabsContent>
            <TabsContent value="contacts" className="mt-0 space-y-4">
              <ContactsTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0 space-y-4">
              <SettingsTab />
            </TabsContent>
            <TabsContent value="system" className="mt-0 space-y-4">
              <SystemSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}