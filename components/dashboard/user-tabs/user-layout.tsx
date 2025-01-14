'use client';

import UserNavbar from "./user-navbar";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}
