import { useState, useCallback } from 'react';
import type { Layer, ShapeType, ColorName, PositionKey } from '../types';

let idCounter = 0;
const genId = (): number => ++idCounter;

interface UseLayers {
  layers: Layer[];
  addLayer: (type: ShapeType, color: ColorName, size: number, position: PositionKey) => void;
  deleteLayer: (id: number) => void;
}

export function useLayers(): UseLayers {
  const [layers, setLayers] = useState<Layer[]>([]);

  const addLayer = useCallback(
    (type: ShapeType, color: ColorName, size: number, position: PositionKey) => {
      const newLayer: Layer = { id: genId(), type, color, size, position,createdAt: Date.now()};
      setLayers((prev) => [newLayer, ...prev]);
    },
    [],
  );

  const deleteLayer = useCallback((id: number) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { layers, addLayer, deleteLayer };
}
