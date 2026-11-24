import React from 'react';
import Icon from './Icon.jsx';

const SPARK_COLORS = {
  blue: '#7796ff',
  violet: '#b28aff',
  mint: '#65e5cd',
  amber: '#ffc178',
};

function Sparkline({ values, color, label }) {
  if (!values?.length) return null;

  const width = 132;
  const height = 51;
  const padding = 4;
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const delta = Math.max(1, maximum - minimum);
  const pointAt = (value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(1, values.length - 1);
    const y = height - padding - ((value - minimum) / delta) * (height - padding * 2);
    return { x, y };
  };
  const points = values.map((value, index) => {
    const point = pointAt(value, index);
    return `${point.x},${point.y}`;
  }).join(' ');
  const lastPoint = pointAt(values[values.length - 1], values.length - 1);

  return (
    <svg className="iw-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="3.5" fill={color} stroke="#121d32" strokeWidth="2" />
    </svg>
  );
}

export default function MetricCard({ item, pulse = 0, signalLabel = 'Simulated' }) {
  const adjustedValue = typeof item.value === 'number'
    ? item.value + (pulse ? Math.sin(pulse * 0.73 + item.value) * 0.75 : 0)
    : null;
  const displayValue = adjustedValue === null
    ? '—'
    : item.unit === 'Gb/s'
      ? adjustedValue.toFixed(2)
      : adjustedValue.toFixed(1);
  const series = item.series?.map((value, index) => value + Math.sin(pulse * 0.8 + index * 0.7) * Math.min(pulse, 5));

  return (
    <article className={`iw-metric iw-metric--${item.color}`}>
      <div className="iw-metric-top">
        <span className="iw-metric-icon"><Icon name={item.icon} size={21} /></span>
        <span className="iw-metric-signal"><span className="iw-live-dot" /> {signalLabel}</span>
      </div>
      <div className="iw-metric-label">{item.title}</div>
      <div className="iw-metric-value">{displayValue}<span>{item.unit}</span></div>
      {item.delta && (
        <div className="iw-metric-trend">
          <span className={item.delta.startsWith('−') ? 'is-positive' : 'is-neutral'}>{item.delta}</span>
          <span>vs. previous period</span>
        </div>
      )}
      {series && (
        <div className="iw-metric-spark">
          <Sparkline values={series} color={SPARK_COLORS[item.color]} label={`${item.title}, xu hướng mô phỏng`} />
        </div>
      )}
      <div className="iw-metric-bottom">
        <span>{item.subtitle}</span>
        <span>{item.unit === 'Gb/s' ? 'Traffic' : 'Average'}</span>
      </div>
    </article>
  );
}
