import type { ColorName, ShapeType, SizeOption, PositionOption } from '../types';

export const SHAPES: ShapeType[] = ['Circle', 'Square', 'Triangle'];

export const COLORS: ColorName[] = [
  'Lime', 'Crimson', 'Cyan', 'Amber', 'Violet', 'Snow', 'Slate',
];

export const COLOR_MAP: Record<ColorName, string> = {
  Lime:    '#c8ff00',
  Crimson: '#ff2d55',
  Cyan:    '#00ffd1',
  Amber:   '#ffb800',
  Violet:  '#bf5af2',
  Snow:    '#f5f5f5',
  Slate:   '#4a5568',
};

export const COLOR_HEX: Record<ColorName, string> = COLOR_MAP;

export const SIZE_OPTIONS: SizeOption[] = [
  { label: '100 × 100', value: 100 },
  { label: '200 × 200', value: 200 },
  { label: '400 × 400', value: 400 },
];

export const POSITION_OPTIONS: PositionOption[] = [
  { label: 'Top Left',     value: 'TL' },
  { label: 'Top Center',   value: 'TC' },
  { label: 'Top Right',    value: 'TR' },
  { label: 'Mid Left',     value: 'ML' },
  { label: 'Center',       value: 'C'  },
  { label: 'Mid Right',    value: 'MR' },
  { label: 'Bot Left',     value: 'BL' },
  { label: 'Bot Center',   value: 'BC' },
  { label: 'Bot Right',    value: 'BR' },
];

export const CANVAS_WIDTH  = 560;
export const CANVAS_HEIGHT = 420;