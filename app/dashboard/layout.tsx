import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuthEdge } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    // Verify token at the layout level
    await verifyAuthEdge(token);
    return (
      <main className="flex-1">
        {children}
      </main>
    );
  } catch (error) {
    console.error('Token verification failed in layout:', error);
    redirect('/login');
  }
}
