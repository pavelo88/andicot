import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | ANDICOT',
  description: 'Gestión de contenidos y CRM de leads para ANDICOT.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
