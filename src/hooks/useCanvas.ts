import { useRef, useEffect } from 'react';
import type { Layer } from '../types';
import { redrawCanvas } from '../utils/canvas';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export function useCanvas(layers: Layer[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      redrawCanvas(canvasRef.current, layers, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [layers]);

  return canvasRef;
}
