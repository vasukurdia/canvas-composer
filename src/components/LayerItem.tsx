import React from 'react';
import type { Layer } from '../types';
import styles from './LayerItem.module.css';

interface LayerItemProps {
  layer: Layer;
  index: number;
  onDelete: (id: number) => void;
}

function shapeLabel(layer: Layer): string {
  return `${layer.type} [${layer.position}]`;
}

export function LayerItem({ layer, index, onDelete }: LayerItemProps) {
  return (
    <div className={styles.row}>
      <span className={styles.name}>
        {index + 1}. {shapeLabel(layer)}
      </span>
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(layer.id)}
        title="Delete layer"
        aria-label={`Delete layer ${index + 1}`}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

function DeleteIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
