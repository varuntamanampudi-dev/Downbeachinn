'use client';

import { usePathname } from 'next/navigation';
import AdminNav from './AdminNav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page gets no sidebar — full screen layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#f1f5f9' }}>
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--color-navy)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #0d9488, #0a7c71)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '0.8rem',
              boxShadow: '0 2px 8px rgba(13,148,136,0.35)',
              flexShrink: 0,
            }}>DB</div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>DownBeach</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-teal-light)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          </div>
        </div>
        <AdminNav />
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
