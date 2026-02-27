import React from 'react';
import type { Layer } from '../types';
import { LayerItem } from './LayerItem';
import styles from './LayerPanel.module.css';

interface LayerPanelProps {
  layers: Layer[];
  onDelete: (id: number) => void;
}

export function LayerPanel({ layers, onDelete }: LayerPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>LAYERS</div>
      {layers.length === 0 ? (
        <p className={styles.empty}>No layers yet.<br />Add a shape to get started.</p>
      ) : (
        layers.map((layer, i) => (
          <LayerItem key={layer.id} layer={layer} index={i} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
