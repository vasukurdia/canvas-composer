export type ShapeType = 'Circle' | 'Square' | 'Triangle';

export type ColorName =
  | 'Lime'
  | 'Crimson'
  | 'Cyan'
  | 'Amber'
  | 'Violet'
  | 'Snow'
  | 'Slate';

export type PositionKey =
  | 'TL' | 'TC' | 'TR'
  | 'ML' | 'C'  | 'MR'
  | 'BL' | 'BC' | 'BR';

export interface SizeOption {
  label: string;
  value: number;
}

export interface PositionOption {
  label: string;
  value: PositionKey;
}

export interface Layer {
  id: number;
  type: ShapeType;
  color: ColorName;
  size: number;
  position: PositionKey;
  createdAt: number;
}