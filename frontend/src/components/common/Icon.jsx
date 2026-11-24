import React from 'react';

const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
  activity: <path d="M3 12h4l3-7 4 14 3-7h4"/>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  settings: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.7 5.7l2.2 2.2m8.2 8.2 2.2 2.2M18.3 5.7l-2.2 2.2m-8.2 8.2-2.2 2.2"/><circle cx="12" cy="12" r="4"/></>,
  cpu: <><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></>,
  memory: <><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7V4M12 7V4M17 7V4M7 17v3M12 17v3M17 17v3M8 11v2M12 11v2M16 11v2"/></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.6 4 3 9 3s9-1.4 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></>,
  network: <><rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v5M5 16v-3h14v3"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 2 20 6v6c0 5-4 8.5-8 10-4-1.5-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.4 9A7.5 7.5 0 0 1 18.5 6L20 7M4 17l1.5 1A7.5 7.5 0 0 0 18.6 15"/></>,
  bars: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <path d="M5 5l14 14M19 5 5 19"/>,
  spark: <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 17v4h16v-4"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
};

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.activity}
    </svg>
  );
}
