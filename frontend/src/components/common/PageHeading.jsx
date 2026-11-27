import React from 'react';

export default function PageHeading({ eyebrow, title, highlight, description, action }) {
  return (
    <div className="iw-heading iw-screen-heading">
      <div>
        <div className="iw-eyebrow"><span /> {eyebrow}</div>
        <h1>{title} <span>{highlight}</span></h1>
        <p>{description}</p>
      </div>
      {action && <div className="iw-screen-heading-action">{action}</div>}
    </div>
  );
}
