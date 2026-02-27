import React from 'react';
import styles from './ControlGroup.module.css';

interface ControlGroupProps {
  label: string;
  children: React.ReactNode;
}

export function ControlGroup({ label, children }: ControlGroupProps) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
