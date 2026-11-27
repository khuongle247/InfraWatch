import React from 'react';
import Icon from './Icon.jsx';

export default function DemoBanner({ children }) {
  return (
    <div className="iw-banner">
      <Icon name="shield" size={17} />
      <span>{children}</span>
      <span className="iw-banner-right">INFRAWATCH / M04</span>
    </div>
  );
}
