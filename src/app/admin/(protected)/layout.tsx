import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminNav from '../_components/AdminNav';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');

  if (!token?.value) {
    redirect('/admin');
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex" }}>
      <AdminNav />
      <div className="admin-content" style={{ flex: 1, overflow: "auto", padding: "clamp(24px,3vw,48px)", maxWidth: "100%" }}>
        {children}
      </div>
    </div>
  );
}
