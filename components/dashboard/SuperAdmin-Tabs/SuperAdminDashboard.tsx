'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SuperAdminOverviewTab } from "./SuperAdminOverviewTab";
import { UsersTab } from "./UsersTab";
import { SchoolsTab } from "./SchoolsTab";
import { ContactsTab } from "./ContactsTab";
import { SettingsTab } from "./SettingsTab";
import SystemSettingsTab from "./SystemSettingsTab";
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

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  studentCount?: number;
  teacherCount?: number;
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
    title: "Contacts",
    value: "contacts",
    icon: MessageSquare,
    disabled: false,
  },
];

const settingsNavItems: NavItem[] = [
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    disabled: false,
  },
  {
    title: "System Settings",
    value: "system-settings",
    icon: Cog,
    disabled: false,
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [schoolsResponse, usersResponse] = await Promise.all([
          fetch('/api/schools', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch('/api/users', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (!schoolsResponse.ok) {
          throw new Error(`Failed to fetch schools: ${schoolsResponse.statusText}`);
        }

        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
        }

        const [schoolsData, usersData] = await Promise.all([
          schoolsResponse.json(),
          usersResponse.json()
        ]);

        setSchools(schoolsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" });
  };

  const handleAddSchool = () => {
    setSelectedSchool(null);
    setIsSchoolModalOpen(true);
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setIsSchoolModalOpen(true);
  };

  const handleSaveSchool = async (school: School) => {
    try {
      const response = await fetch('/api/schools', {
        method: school.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(school),
      });

      if (!response.ok) {
        throw new Error('Failed to save school');
      }

      // Refresh schools list
      const updatedSchoolsResponse = await fetch('/api/schools');
      const updatedSchools = await updatedSchoolsResponse.json();
      setSchools(updatedSchools);
      setIsSchoolModalOpen(false);
    } catch (error) {
      console.error('Error saving school:', error);
    }
  };

  const handleUsersChange = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <Building2 className="h-6 w-6 mr-2" />
          <span className="text-xl font-bold">QuizzQ</span>
        </div>

        <nav className="flex-1 space-y-8">
          <div className="space-y-2">
            {mainNavItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:text-white hover:bg-gray-800",
                  activeTab === item.value && "bg-gray-800"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.title}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {settingsNavItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:text-white hover:bg-gray-800",
                  activeTab === item.value && "bg-gray-800"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.title}
              </Button>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-800"
              onClick={() => window.open('https://docs.quizzq.com', '_blank')}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-800"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="overview" className="m-0">
            <SuperAdminOverviewTab />
          </TabsContent>
          <TabsContent value="users" className="mt-0 flex-1 overflow-hidden">
            <UsersTab
              users={users}
              schools={schools}
              isLoading={isLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onUsersChange={handleUsersChange}
            />
          </TabsContent>
          <TabsContent value="schools" className="m-0">
            <SchoolsTab 
              schools={schools}
              onAddSchool={handleAddSchool}
              onEditSchool={handleEditSchool}
              onSaveSchool={handleSaveSchool}
              selectedSchool={selectedSchool}
              isSchoolModalOpen={isSchoolModalOpen}
              setIsSchoolModalOpen={setIsSchoolModalOpen}
              isLoading={false}
              onSchoolsChange={setSchools}
            />
          </TabsContent>
          <TabsContent value="contacts" className="m-0">
            <ContactsTab />
          </TabsContent>
          <TabsContent value="settings" className="m-0">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="system-settings" className="m-0">
            <SystemSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}