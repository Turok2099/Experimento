import React, { ReactNode } from 'react';
import styles from '@/styles/admin.module.scss';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li>
              <Link href="/admindashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/adminusers">Usuarios</Link>
            </li>
            <li>
              <Link href="/admin/trainers">Entrenadores</Link>
            </li>
            <li>
              <Link href="/admin/roles">Roles y Permisos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}