import React from 'react';
import styles from './Select.module.css';

interface Option<T extends string | number> {
  label: string;
  value: T;
}

interface SelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[] | T[];
}

function isOptionObject<T extends string | number>(
  opt: Option<T> | T,
): opt is Option<T> {
  return typeof opt === 'object' && opt !== null && 'value' in opt;
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
}: SelectProps<T>) {
  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          // Preserve number type if original value was number
          const coerced = typeof value === 'number' ? (Number(raw) as T) : (raw as T);
          onChange(coerced);
        }}
      >
        {options.map((opt) => {
          const val   = isOptionObject(opt) ? opt.value : opt;
          const label = isOptionObject(opt) ? opt.label : opt;
          return (
            <option key={String(val)} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      <span className={styles.chevron}>▾</span>
    </div>
  );
}
