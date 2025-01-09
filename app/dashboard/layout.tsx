import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-4 -left-4 h-96 w-96 rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-3xl" />
        <div className="animate-float-medium absolute top-1/2 -right-32 h-[40rem] w-[40rem] rounded-full bg-purple-400/30 dark:bg-purple-500/20 blur-3xl" />
        <div className="animate-float-fast absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-grid-white/[0.2] dark:bg-grid-white/[0.1] bg-[size:20px_20px] animate-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-white/80 dark:from-background/20 dark:via-background/60 dark:to-background/90 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
