import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuthEdge } from '@/lib/auth';
import { Footer } from '@/components/footer';

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
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Token verification failed in layout:', error);
    redirect('/login');
  }
}
