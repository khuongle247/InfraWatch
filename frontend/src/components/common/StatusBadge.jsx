import React from 'react';

const STATE_CLASSES = {
  Healthy: '',
  Warning: 'iw-state--warning',
  Offline: 'iw-state--offline',
  Running: 'iw-state--running',
  Stopped: 'iw-state--stopped',
  Critical: 'iw-state--critical',
  High: 'iw-state--high',
  Info: 'iw-state--info',
  Firing: 'iw-state--firing',
  Acknowledged: 'iw-state--acknowledged',
  Resolved: 'iw-state--resolved',
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
