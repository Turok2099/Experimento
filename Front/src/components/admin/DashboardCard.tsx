'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/admin.module.scss'; 

interface MenuCardProps {
  href: string;
  icon: React.ReactNode; 
  title: string;
  description: string;
}

export default function MenuCard({ href, icon, title, description }: MenuCardProps) {
  return (
    <Link href={href} className={styles.menuCard}>
      <div className={styles.menuCardIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}