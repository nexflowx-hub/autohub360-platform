import { redirect } from 'next/navigation';

/**
 * V1 skeleton only. The operational backoffice is a future deliverable —
 * this app exists to reserve the deployment slot and document the plan.
 * Authentication will use Supabase Auth with server-verified staff/admin roles
 * (never client-editable metadata).
 */
export default function AdminHome() {
  redirect('/dashboard');
}
