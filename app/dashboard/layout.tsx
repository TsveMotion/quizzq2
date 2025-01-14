import { ThemeProvider } from 'next-themes'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserNavbar } from "@/components/dashboard/user-tabs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      forcedTheme="dark"
    >
      <div className="min-h-screen bg-[#1A1D23]">
        <UserNavbar initialSession={session} />
        <main className="md:pl-64">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
