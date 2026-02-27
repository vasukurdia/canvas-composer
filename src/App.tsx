import React, { useState } from 'react';
import { useLayers } from './hooks/useLayers';
import { useCanvas } from './hooks/useCanvas';
import { SHAPES, COLORS, COLOR_MAP, SIZE_OPTIONS, POSITION_OPTIONS, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import type { ShapeType, ColorName, PositionKey } from './types';

function ShapeIcon({ type, size = 14 }: { type: ShapeType; size?: number }) {
  if (type === 'Circle')
    return <svg width={size} height={size} viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="currentColor" /></svg>;
  if (type === 'Square')
    return <svg width={size} height={size} viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" fill="currentColor" /></svg>;
  return <svg width={size} height={size} viewBox="0 0 14 14"><polygon points="7,1 13,13 1,13" fill="currentColor" /></svg>;
}

const POS_GRID: PositionKey[] = ['TL','TC','TR','ML','C','MR','BL','BC','BR'];

function PositionGrid({ value, onChange }: { value: PositionKey; onChange: (v: PositionKey) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 28px)', gap: 4 }}>
      {POS_GRID.map((pos) => (
        <button key={pos} onClick={() => onChange(pos)} title={pos} style={{
          width: 28, height: 28,
          background: value === pos ? 'var(--accent)' : 'var(--surface2)',
          border: value === pos ? '1px solid var(--accent)' : '1px solid var(--border2)',
          borderRadius: 2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s', padding: 0,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: value === pos ? '#000' : 'var(--text-muted)',
          }} />
        </button>
      ))}
    </div>
  );
}

function StyledSelect<T extends string | number>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { label: string; value: T }[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          onChange((typeof value === 'number' ? Number(raw) : raw) as T);
        }}
        style={{
          width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)',
          color: 'var(--text)', padding: '7px 28px 7px 10px', borderRadius: 2,
          appearance: 'none', fontSize: 12, fontFamily: 'var(--font-mono)',
          cursor: 'pointer', outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border2)')}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-muted)', pointerEvents: 'none', fontSize: 10,
      }}>▾</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />;
}

function ColorPicker({ value, onChange }: { value: ColorName; onChange: (v: ColorName) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {COLORS.map((c) => (
        <button key={c} title={c} onClick={() => onChange(c)} style={{
          width: 22, height: 22, borderRadius: 2, background: COLOR_MAP[c],
          border: value === c ? '2px solid var(--accent)' : '2px solid transparent',
          cursor: 'pointer', padding: 0, transition: 'transform 0.1s',
          boxShadow: value === c ? '0 0 0 1px var(--accent)' : 'none',
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        />
      ))}
    </div>
  );
}

function ShapePicker({ value, onChange }: { value: ShapeType; onChange: (v: ShapeType) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {SHAPES.map((s) => (
        <button key={s} onClick={() => onChange(s)} title={s} style={{
          flex: 1, padding: '8px 0',
          background: value === s ? 'var(--accent)' : 'var(--surface2)',
          border: value === s ? '1px solid var(--accent)' : '1px solid var(--border2)',
          borderRadius: 2, color: value === s ? '#000' : 'var(--text-muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 5, fontSize: 10,
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          letterSpacing: '0.05em', transition: 'all 0.12s',
        }}>
          <ShapeIcon type={s} size={12} />
          {s.toUpperCase().slice(0, 3)}
        </button>
      ))}
    </div>
  );
}

function LayerRow({ index, layer, onDelete, isNew }: {
  index: number;
  layer: { id: number; type: ShapeType; color: ColorName; position: PositionKey; size: number };
  onDelete: (id: number) => void;
  isNew: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 8px', borderRadius: 2,
        background: hovered ? 'var(--surface2)' : 'transparent',
        border: '1px solid',
        borderColor: isNew ? 'var(--accent)' : hovered ? 'var(--border2)' : 'transparent',
        transition: 'all 0.2s', cursor: 'default',
        animation: isNew ? 'slideIn 0.25s ease' : 'none',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: COLOR_MAP[layer.color], flexShrink: 0,
        boxShadow: `0 0 6px ${COLOR_MAP[layer.color]}88`,
      }} />
      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
        <ShapeIcon type={layer.type} size={11} />
      </span>

      {/* FIX #6 — position badge */}
      <span style={{
        flex: 1, fontSize: 11, color: 'var(--text)',
        letterSpacing: '0.03em', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        #{String(index + 1).padStart(2, '0')} {layer.type}
        <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>[{layer.position}]</span>
      </span>

      {/* FIX #7 — size badge */}
      <span style={{
        fontSize: 9, color: 'var(--text-muted)', background: 'var(--surface)',
        padding: '2px 5px', borderRadius: 2, letterSpacing: '0.05em', flexShrink: 0,
      }}>
        {layer.size}px
      </span>

      <button onClick={() => onDelete(layer.id)} style={{
        background: 'none', border: 'none',
        color: hovered ? 'var(--danger)' : 'var(--text-dim)',
        cursor: 'pointer', padding: '2px 4px', borderRadius: 2,
        fontSize: 12, lineHeight: 1, transition: 'color 0.15s', flexShrink: 0,
      }} title="Delete layer">✕</button>
    </div>
  );
}


export default function App() {
  const [shape, setShape]       = useState<ShapeType>('Circle');
  const [color, setColor]       = useState<ColorName>('Lime');
  const [size, setSize]         = useState<number>(200);
  const [position, setPosition] = useState<PositionKey>('C');

  const { layers, addLayer, deleteLayer } = useLayers();
  const canvasRef = useCanvas(layers);
  const latestId  = layers[0]?.id ?? null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 220px',
        gridTemplateRows: '48px 1fr',
        height: '100vh',
      }}>

        {/* TOPBAR */}
        <div style={{
          gridColumn: '1 / -1', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
        }}>
          <div style={{
            width: 24, height: 24, background: 'var(--accent)', borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect x="1" y="1" width="5" height="5" fill="#000" />
              <circle cx="10.5" cy="3.5" r="2.5" fill="#000" />
              <polygon points="7,8 13,13 1,13" fill="#000" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text)' }}>
            SHAPEFORGE
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em', marginLeft: 2 }}>
            — CANVAS COMPOSER
          </span>

          {/* FIX #3 — layer count */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {layers.length} LAYER{layers.length !== 1 ? 'S' : ''}
            </span>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)', animation: 'pulse 2s infinite',
            }} />
          </div>
        </div>

        {/* LEFT PANEL */}
        <div style={{
          background: 'var(--surface)', borderRight: '1px solid var(--border)',
          padding: '20px 16px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>
          <Label>Shape</Label>
          <ShapePicker value={shape} onChange={setShape} />
          <Divider />
          <Label>Color</Label>
          <ColorPicker value={color} onChange={setColor} />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 1,
              background: COLOR_MAP[color],
              boxShadow: `0 0 8px ${COLOR_MAP[color]}99`,
            }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {color} — {COLOR_MAP[color]}
            </span>
          </div>
          <Divider />
          <Label>Fit Size</Label>
          <StyledSelect<number> value={size} onChange={setSize} options={SIZE_OPTIONS} />
          <Divider />
          <Label>Position</Label>
          <PositionGrid value={position} onChange={setPosition} />
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
            {POSITION_OPTIONS.find(p => p.value === position)?.label ?? position}
          </div>
          <Divider />
          <button
            onClick={() => addLayer(shape, color, size, position)}
            style={{
              padding: '12px 0', background: 'var(--accent)', border: 'none',
              borderRadius: 2, color: '#000', fontFamily: 'var(--font-mono)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseDown={(e)  => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e)    => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> ADD SHAPE
          </button>

          {/* FIX #5 — footer stays dim intentionally */}
          <div style={{ marginTop: 'auto', paddingTop: 24, fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.06em', lineHeight: 1.8 }}>
            CANVAS COMPOSER v2.0<br />NO LIBS · CANVAS API · REACT 18
          </div>
        </div>

        {/* CANVAS CENTER */}
        <div style={{
          background: 'var(--bg)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px', opacity: 0.4,
          }} />
          <div style={{
            position: 'relative',
            boxShadow: '0 0 0 1px var(--border2), 0 0 40px rgba(200,255,0,0.04)',
          }}>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block' }} />
          </div>

          {/* FIX #4 — Empty canvas message */}
          {layers.length === 0 && (
            <div style={{
              position: 'absolute', pointerEvents: 'none',
              textAlign: 'center', color: 'var(--text-muted)',
              fontSize: 11, letterSpacing: '0.1em',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>◻</div>
              ADD A SHAPE TO BEGIN
            </div>
          )}
        </div>

        {/* RIGHT PANEL — LAYERS */}
        <div style={{
          background: 'var(--surface)', borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 14px 10px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Layers
            </span>
            <span style={{
              fontSize: 9, color: 'var(--accent)',
              background: 'rgba(200,255,0,0.08)',
              padding: '2px 6px', borderRadius: 2, letterSpacing: '0.06em',
            }}>
              {layers.length}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {layers.length === 0 ? (
              // FIX #8 — "No layers yet"
              <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.06em', lineHeight: 1.8 }}>
                No layers yet.<br />
                <span style={{ fontSize: 9, opacity: 0.6 }}>ADD SHAPE to start.</span>
              </div>
            ) : (
              layers.map((layer, i) => (
                <LayerRow key={layer.id} index={i} layer={layer} onDelete={deleteLayer} isNew={layer.id === latestId && i === 0} />
              ))
            )}
          </div>

          {layers.length > 0 && (
            <div style={{
              padding: '10px 14px', borderTop: '1px solid var(--border)',
              fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.06em', lineHeight: 1.8, flexShrink: 0,
            }}>
              STACK ↑ NEWEST ON TOP<br />CLICK ✕ TO REMOVE
            </div>
          )}
        </div>
      </div>
    </>
  );
}