// src/app/admin/layout.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nandeeka CMS — Admin",
  description: "Admin panel for Nandeeka CMS",
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "⊞" },
  { label: "Projects", href: "/admin/projects", icon: "◈" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">N</span>
          <span className="brand-name">Nandeeka</span>
          <span className="brand-tag">CMS</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-link">
              <span className="link-icon">{item.icon}</span>
              <span className="link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/admin/login" className="logout-btn">
            <span>⎋</span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-title">Admin Panel</div>
          <div className="topbar-actions">
            <Link href="/" className="topbar-link">
              ↗ View Site
            </Link>
            <div className="avatar">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">{children}</main>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          height: 100vh;
          background: #0f0f14;
          color: #e2e8f0;
          font-family: var(--font-geist-sans, 'Inter', sans-serif);
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          width: 220px;
          min-width: 220px;
          background: #13131a;
          border-right: 1px solid #1e1e2e;
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          gap: 8px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px 24px;
          border-bottom: 1px solid #1e1e2e;
        }

        .brand-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
          color: #fff;
          flex-shrink: 0;
        }

        .brand-name {
          font-weight: 700;
          font-size: 15px;
          color: #f1f5f9;
          letter-spacing: 0.3px;
        }

        .brand-tag {
          font-size: 10px;
          font-weight: 600;
          background: rgba(99,102,241,0.2);
          color: #818cf8;
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(99,102,241,0.3);
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 16px 12px 0;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
        }

        .sidebar-link:hover {
          background: rgba(99,102,241,0.1);
          color: #c7d2fe;
        }

        .link-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid #1e1e2e;
          margin-top: auto;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #f87171;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s;
        }

        .logout-btn:hover {
          background: rgba(248,113,113,0.1);
        }

        /* ── Main ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-topbar {
          height: 60px;
          background: #13131a;
          border-bottom: 1px solid #1e1e2e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          flex-shrink: 0;
        }

        .topbar-title {
          font-size: 15px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.3px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .topbar-link {
          font-size: 13px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .topbar-link:hover {
          color: #a5b4fc;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
        }

        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
      `}</style>
    </div>
  );
}
