'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import styles from '@/_styles/cssUserPanelPage/UsageChart.module.css';

export type ChartSeries = { key: string; label: string; color: string; dash: string };
export type ChartRow = { date: string } & Record<string, number | string>;

type Props = {
  title: string;
  rows: ChartRow[];
  series: ChartSeries[];
};

const HEIGHT = 260;
const PAD = { top: 16, right: 44, bottom: 28, left: 44 };
const num = new Intl.NumberFormat('pt-BR');
const fmtDay = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7);
const fmtLong = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

/** Clean axis maximum and step (1, 2, 5 × 10^n). */
function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { top: 4, step: 1 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  return { top: Math.ceil(max / step) * step, step };
}

/**
 * Daily usage, one line per metric (single y-axis: all are counts of events). Hover or arrow keys
 * move a crosshair that reads every series on that day; the same numbers are in the table below.
 */
export function UsageLineChart({ title, rows, series }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const values = (k: string) => rows.map((r) => Number(r[k]) || 0);
  const max = Math.max(0, ...series.flatMap((s) => values(s.key)));
  const { top, step } = niceScale(max);
  const plotW = width - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (rows.length <= 1 ? plotW / 2 : (i / (rows.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;

  const yTicks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const labelEvery = Math.max(1, Math.ceil(rows.length / Math.max(2, Math.floor(plotW / 64))));
  const empty = max === 0;

  const pick = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || !rows.length) return;
    const rel = (clientX - rect.left - PAD.left) / plotW;
    setActive(Math.min(rows.length - 1, Math.max(0, Math.round(rel * (rows.length - 1)))));
  };

  const onKey = (e: KeyboardEvent) => {
    const last = rows.length - 1;
    const cur = active ?? last;
    const next = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(Math.min(last, Math.max(0, next)));
  };

  // value at the end of each line (direct label); one that would overlap the previous one is skipped
  const last = rows.length - 1;
  const endLabels = series
    .map((s) => ({ key: s.key, v: values(s.key)[last] ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .reduce<{ key: string; v: number; y: number }[]>((acc, l) => {
      const ly = y(l.v);
      if (acc.every((p) => Math.abs(p.y - ly) >= 13)) acc.push({ ...l, y: ly });
      return acc;
    }, []);

  const activeRow = active !== null ? rows[active] : null;
  // tooltip on the side with more room
  const tipLeft = active !== null && x(active) > width / 2;

  return (
    <figure className={styles['usage-chart']} aria-labelledby={titleId}>
      <figcaption className={styles['usage-chart__head']}>
        <span className={styles['usage-chart__title']} id={titleId}>{title}</span>
        <ul className={styles['usage-chart__legend']} aria-label="Legenda">
          {series.map((s) => (
            <li key={s.key} className={styles['usage-chart__legend-item']}>
              <svg width="20" height="10" aria-hidden="true" className={styles['usage-chart__key']}>
                <line x1="1" y1="5" x2="19" y2="5" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeDasharray={s.dash} />
              </svg>
              {s.label}
            </li>
          ))}
        </ul>
      </figcaption>

      <div
        ref={wrapRef}
        className={styles['usage-chart__plot']}
        tabIndex={0}
        role="group"
        aria-label={`${title}. Use as setas para ler cada dia; os mesmos dados estão na tabela abaixo.`}
        onPointerMove={(e: PointerEvent) => pick(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg width={width} height={HEIGHT} className={styles['usage-chart__svg']} aria-hidden="true">
          {/* grid + y ticks */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'} strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t)} className={styles['usage-chart__tick']} textAnchor="end" dominantBaseline="middle">
                {num.format(t)}
              </text>
            </g>
          ))}
          {/* x ticks */}
          {rows.map((r, i) =>
            i % labelEvery === 0 || i === rows.length - 1 ? (
              <text key={r.date} x={x(i)} y={HEIGHT - 8} className={styles['usage-chart__tick']} textAnchor="middle">
                {fmtDay(r.date)}
              </text>
            ) : null,
          )}

          {/* crosshair */}
          {active !== null && (
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--viz-axis)" strokeWidth="1" />
          )}

          {/* one 2px line per series */}
          {series.map((s) => (
            <polyline
              key={s.key}
              points={values(s.key).map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={s.dash}
            />
          ))}

          {/* direct labels: last value at the end of each line (text ink, never the series color) */}
          {!empty &&
            rows.length > 0 &&
            endLabels.map((l) => (
              <text key={l.key} x={x(last) + 8} y={l.y} className={styles['usage-chart__end']} dominantBaseline="middle">
                {num.format(l.v)}
              </text>
            ))}

          {/* markers on the active day: 8px dot with a 2px surface ring */}
          {active !== null &&
            series.map((s) => (
              <circle key={s.key} cx={x(active)} cy={y(values(s.key)[active])} r="4" fill={s.color} stroke="var(--pn-bg, #fff)" strokeWidth="2" />
            ))}
        </svg>

        {empty && <p className={styles['usage-chart__empty']}>Ainda não há uso neste período.</p>}

        {activeRow && (
          <div
            className={`${styles['usage-chart__tip']} ${tipLeft ? styles['usage-chart__tip--left'] : ''}`}
            style={{ transform: `translateX(${tipLeft ? x(active!) - 12 : x(active!) + 12}px)` }}
            role="status"
          >
            <p className={styles['usage-chart__tip-date']}>{fmtLong(activeRow.date)}</p>
            <ul className={styles['usage-chart__tip-list']}>
              {series.map((s) => (
                <li key={s.key} className={styles['usage-chart__tip-row']}>
                  <svg width="14" height="8" aria-hidden="true">
                    <line x1="1" y1="4" x2="13" y2="4" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeDasharray={s.dash} />
                  </svg>
                  <strong className={styles['usage-chart__tip-value']}>{num.format(Number(activeRow[s.key]) || 0)}</strong>
                  <span className={styles['usage-chart__tip-label']}>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* the same numbers without the chart (screen readers, low vision, copy/paste) */}
      <details className={styles['usage-chart__table-wrap']}>
        <summary className={styles['usage-chart__summary']}>Ver os dados em tabela</summary>
        <div className={styles['usage-chart__scroll']}>
          <table className={styles['usage-chart__table']}>
            <caption className={styles['usage-chart__sr-only']}>{title}</caption>
            <thead>
              <tr>
                <th scope="col" className={styles['usage-chart__th']}>Dia</th>
                {series.map((s) => (
                  <th key={s.key} scope="col" className={styles['usage-chart__th']}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date}>
                  <th scope="row" className={styles['usage-chart__td']}>{fmtDay(r.date)}</th>
                  {series.map((s) => (
                    <td key={s.key} className={`${styles['usage-chart__td']} ${styles['usage-chart__td--num']}`}>
                      {num.format(Number(r[s.key]) || 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
