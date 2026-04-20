import type { Metadata } from 'next';
import AdminShell from './AdminShell';

export const metadata: Metadata = { title: 'DownBeach Admin' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
