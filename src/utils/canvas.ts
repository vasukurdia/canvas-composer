import type { Layer, PositionKey } from '../types';
import { COLOR_MAP } from '../constants';

export function getShapeOrigin(
  pos: PositionKey,
  size: number,
  canvasW: number,
  canvasH: number,
): [number, number] {
  const half = size / 2;

  const xMap: Record<string, number> = {
    L: 0,
    C: canvasW / 2 - half,
    R: canvasW - size,
  };

  const yMap: Record<string, number> = {
    T: 0,
    M: canvasH / 2 - half,
    B: canvasH - size,
  };

  // pos is like 'TL', 'C', 'BR', etc.
  if (pos === 'C') return [xMap['C'], yMap['M']];

  const yChar = pos[0]; // T | M | B
  const xChar = pos[1]; // L | C | R

  return [xMap[xChar] ?? 0, yMap[yChar] ?? 0];
}

/**
 * Draw a single layer onto the canvas context.
 */
export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  canvasW: number,
  canvasH: number,
): void {
  const { type, color, size, position } = layer;
  const [x, y] = getShapeOrigin(position, size, canvasW, canvasH);

  ctx.fillStyle = COLOR_MAP[color];
  ctx.beginPath();

  switch (type) {
    case 'Circle': {
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Square': {
      ctx.fillRect(x, y, size, size);
      break;
    }

    case 'Triangle': {
  // Isosceles triangle, apex at top, base at bottom
  // No centroid offset — keep within bounding box
  const apexX = x + size / 2;
  const apexY = y;                // apex at top of bounding box
  const baseY = y + size;
  ctx.moveTo(apexX, apexY);
  ctx.lineTo(x, baseY);
  ctx.lineTo(x + size, baseY);
  ctx.closePath();
  ctx.fill();
  break;
}
  }
}

/**
 * Redraw all layers on a canvas element.
 * Layers array is ordered newest-first (index 0 = top of stack).
 * We paint oldest-first so newer layers appear on top.
 */
export function redrawCanvas(
  canvas: HTMLCanvasElement,
  layers: Layer[],
  canvasW: number,
  canvasH: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasW, canvasH);

  // layers[0] is newest → draw in reverse so it ends up on top
  const drawOrder = [...layers].reverse();
  drawOrder.forEach((layer) => drawLayer(ctx, layer, canvasW, canvasH));
}
