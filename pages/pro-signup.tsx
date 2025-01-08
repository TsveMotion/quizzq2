import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function ProSignup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = router.query.session_id;
      
      if (!sessionId) {
        setError('Invalid session');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/verify-pro-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!data.success) {
          setError('Payment verification failed');
          setIsVerifying(false);
          return;
        }

        // Payment verified, create PRO account
        const createResponse = await fetch('/api/create-pro-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: session?.user?.email,
            sessionId 
          }),
        });

        const createData = await createResponse.json();

        if (createData.success) {
          router.push('/dashboard?pro=activated');
        } else {
          setError('Failed to create PRO account');
        }
      } catch (err) {
        setError('An error occurred');
      }
      
      setIsVerifying(false);
    };

    if (router.isReady && status === 'authenticated') {
      verifyPayment();
    }
  }, [router.isReady, status, router, session]);

  if (status === 'loading' || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verifying your payment...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/pricing')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    );
  }

  return null;
}
