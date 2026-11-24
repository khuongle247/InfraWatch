import React from 'react';

const STATE_CLASSES = {
  Healthy: '',
  Warning: 'iw-state--warning',
  Offline: 'iw-state--offline',
};

export default function StatusBadge({ state, children }) {
  const label = children || state;
  const stateClass = STATE_CLASSES[state] || '';

  return (
    <span className={`iw-state ${stateClass}`.trim()}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}
