import { getSchoolData } from './page-server';
import { Suspense } from 'react';

export default async function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const school = await getSchoolData();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
