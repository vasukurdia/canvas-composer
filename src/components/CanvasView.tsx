import React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import styles from './CanvasView.module.css';

interface CanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function CanvasView({ canvasRef }: CanvasViewProps) {
  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      />
    </div>
  );
}
