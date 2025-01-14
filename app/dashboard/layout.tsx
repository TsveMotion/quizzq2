import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { ThemeProvider } from "@/components/theme-provider";
import { UserLayout } from "@/components/dashboard/user-tabs";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // Redirect based on user role
  switch (session.user.role) {
    case "SUPERADMIN":
      return <SuperAdminLayout>{children}</SuperAdminLayout>;
    default:
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserLayout>{children}</UserLayout>
        </ThemeProvider>
      );
  }
}
