'use client';

import Navbar from '@/components/layout/Navbar';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
