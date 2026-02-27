import React from 'react';
import { ControlGroup } from './ControlGroup';
import { Select } from './Select';
import type { ShapeType, ColorName, PositionKey } from '../types';
import {
  SHAPES,
  COLORS,
  SIZE_OPTIONS,
  POSITION_OPTIONS,
} from '../constants';
import styles from './Controls.module.css';

interface ControlsProps {
  shape: ShapeType;
  color: ColorName;
  size: number;
  position: PositionKey;
  onShapeChange: (v: ShapeType) => void;
  onColorChange: (v: ColorName) => void;
  onSizeChange: (v: number) => void;
  onPositionChange: (v: PositionKey) => void;
  onAdd: () => void;
}

export function Controls({
  shape,
  color,
  size,
  position,
  onShapeChange,
  onColorChange,
  onSizeChange,
  onPositionChange,
  onAdd,
}: ControlsProps) {
  return (
    <div className={styles.panel}>
      <ControlGroup label="Shape">
        <Select<ShapeType>
          value={shape}
          onChange={onShapeChange}
          options={SHAPES.map((s) => ({ label: s, value: s }))}
        />
      </ControlGroup>

      <ControlGroup label="Color">
        <Select<ColorName>
          value={color}
          onChange={onColorChange}
          options={COLORS.map((c) => ({ label: c, value: c }))}
        />
      </ControlGroup>

      <ControlGroup label="Size Fit">
        <Select<number>
          value={size}
          onChange={onSizeChange}
          options={SIZE_OPTIONS}
        />
      </ControlGroup>

      <ControlGroup label="Position">
        <Select<PositionKey>
          value={position}
          onChange={onPositionChange}
          options={POSITION_OPTIONS}
        />
      </ControlGroup>

      <div className={styles.addWrapper}>
        <button className={styles.addBtn} onClick={onAdd}>
          <span className={styles.plus}>+</span> ADD SHAPE
        </button>
      </div>
    </div>
  );
}
