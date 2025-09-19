'use client';

import React from 'react';
import styles from '@/styles/admin.module.scss';
import { StatsCardProps } from '@/types/index';


export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsIcon}>
        {icon}
      </div>
      <div className={styles.statsContent}>
        <span className={styles.statsTitle}>{title}</span>
        <span className={styles.statsValue}>{value}</span>
      </div>
    </div>
  );
}