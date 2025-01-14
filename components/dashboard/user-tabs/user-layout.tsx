'use client';

import { UserNavbar } from "./user-navbar";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#1a237e]">
      <UserNavbar />
      <main className="md:pl-72 p-6 pt-24 min-h-screen">
        {children}
      </main>
    </div>
  );
}
