import React from 'react';
import Icon from './Icon.jsx';

export default function SummaryStat({ label, value, detail, icon, tone = 'blue' }) {
  return (
    <article className={`iw-summary-stat iw-summary-stat--${tone}`}>
      <span className="iw-summary-stat-icon"><Icon name={icon} size={19} /></span>
      <div className="iw-summary-stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}
