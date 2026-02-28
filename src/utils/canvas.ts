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

  if (pos === 'C') return [xMap['C'], yMap['M']];

  const yChar = pos[0];
  const xChar = pos[1];

  return [xMap[xChar] ?? 0, yMap[yChar] ?? 0];
}

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
  const apexX = x + size / 2;
  const apexY = y;
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

export function redrawCanvas(
  canvas: HTMLCanvasElement,
  layers: Layer[],
  canvasW: number,
  canvasH: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvasW, canvasH);

  const drawOrder = [...layers].reverse();
  drawOrder.forEach((layer) => drawLayer(ctx, layer, canvasW, canvasH));
}
