import { AdminShell } from '@/components/admin-shell';
import { requireAdminSession } from '@/lib/admin-session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return <AdminShell>{children}</AdminShell>;
}
