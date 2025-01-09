import { 
  LayoutDashboard, 
  Users, 
  School, 
  MessageSquare,
  Settings,
  Cog,
} from "lucide-react";

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
  section?: string;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Users",
    value: "users",
    icon: Users,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Schools",
    value: "schools",
    icon: School,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Contacts",
    value: "contacts",
    icon: MessageSquare,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    disabled: false,
    section: "system"
  },
  {
    title: "System",
    value: "system",
    icon: Cog,
    disabled: false,
    section: "system"
  },
];
