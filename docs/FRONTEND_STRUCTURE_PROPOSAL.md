# InfraWatch Frontend — React Structure and W03 Prototypes

This document records the frontend structure and the W03 UI prototype scope as implemented. All monitoring values on these screens are illustrative mock data; no monitoring backend or live service is connected.

## W03 prototype screens

| Screen | Route | React implementation | Prototype coverage |
|---|---|---|---|
| Overview Dashboard | `#/overview` | [`Overview.jsx`](../frontend/src/pages/Overview.jsx) | Existing overview, summary metrics, trends, host inventory, alerts and demo interactions |
| Host Monitoring | `#/hosts` | [`Hosts.jsx`](../frontend/src/pages/Hosts.jsx) | Host inventory, search/status filters, selected-host detail and illustrative metric history |
| Container Monitoring | `#/containers` | [`Containers.jsx`](../frontend/src/pages/Containers.jsx) | Summary cards, searchable/filterable container inventory and selected-container detail |
| Service Monitoring | `#/services` | [`Services.jsx`](../frontend/src/pages/Services.jsx) | Service health catalog, status filter, sample KPIs and selected-service detail |
| Alerts | `#/alerts` | [`Alerts.jsx`](../frontend/src/pages/Alerts.jsx) | Severity/state filters, event list and selected-alert context |

The static [Overview wireframe](./wireframes/overview-wireframe.html) and [Host wireframe](./wireframes/hosts-wireframe.html) remain design references. The five React screens above are the in-app prototypes. There is no separate static wireframe for Containers, Services or Alerts.

## Current source structure

```text
frontend/src/
├── App.jsx
├── main.jsx
├── components/
│   └── common/
│       ├── DemoBanner.jsx
│       ├── Icon.jsx
│       ├── MetricCard.jsx
│       ├── PageHeading.jsx
│       ├── StatusBadge.jsx
│       └── SummaryStat.jsx
├── data/
│   └── monitoringDemo.js
├── hooks/
│   └── useDashboardRoute.js
├── layouts/
│   ├── DashboardLayout.jsx
│   ├── Header.jsx
│   └── Sidebar.jsx
├── pages/
│   ├── Alerts.jsx
│   ├── Containers.jsx
│   ├── Hosts.jsx
│   ├── Overview.jsx
│   └── Services.jsx
├── services/                     # No API service implemented in W03
├── styles/
│   ├── hosts.css
│   ├── monitoring.css
│   └── overview.css
└── utils/
    ├── getDashboardPage.js
    └── getDashboardPage.test.js
```

### Component responsibilities

- **App and route hook:** [`App.jsx`](../frontend/src/App.jsx) maps the supported hash route to a page. [`useDashboardRoute.js`](../frontend/src/hooks/useDashboardRoute.js) initializes and follows hash changes; unknown routes resolve to Overview.
- **Shared shell:** [`DashboardLayout.jsx`](../frontend/src/layouts/DashboardLayout.jsx) composes the page frame, navigation, header and demo toast. [`Sidebar.jsx`](../frontend/src/layouts/Sidebar.jsx) provides links and selected-page state; [`Header.jsx`](../frontend/src/layouts/Header.jsx) retains the existing shared header and actions.
- **Pages:** `pages/` composes screen-specific UI. Page-local selection, search and filters stay with each prototype.
- **Reusable UI:** `Icon`, `MetricCard`, `StatusBadge`, `DemoBanner`, `PageHeading` and `SummaryStat` provide repeated visual patterns.
- **Mock data:** [`monitoringDemo.js`](../frontend/src/data/monitoringDemo.js) holds sample hosts, containers, services, alerts and overview metrics. It is not an API client.
- **Styles and utilities:** `overview.css` preserves the existing Overview/shared-shell styling; `hosts.css` styles Host Monitoring; `monitoring.css` styles the three new monitoring prototypes. `getDashboardPage.js` is the pure route resolver covered by the adjacent Vitest test.

## Navigation and user flow

```text
Any screen
  ├── Sidebar: Overview    → #/overview
  ├── Sidebar: Hosts       → #/hosts
  ├── Sidebar: Containers  → #/containers
  ├── Sidebar: Services    → #/services
  └── Sidebar: Alerts      → #/alerts

Overview host inventory → Hosts
Each monitoring list     → select an item → update its local detail panel
```

Navigation uses the existing hash mechanism; no routing dependency was added. Every sidebar destination has an active state, page title and shared layout. The selected-item panels and filters are local prototype interactions, not persisted operations.

## W03 boundary

### Implemented

- Five reachable React prototype screens, including Overview and Host Monitoring.
- Shared page shell, navigation, common status/heading/stat/banner UI and route hook.
- Structured mock data, visible demo disclaimers, list filtering/search and detail panels for the three new screens.
- Responsive layouts, keyboard-focus styling and empty-result states for the new monitoring screens.
- Hash route mapping tests for all five pages and default/unknown-route behavior; server-render smoke tests for the Containers, Services and Alerts prototypes.

### Deferred to W04 and later

- Review and approval of wireframes/user flows with the project team.
- Real API contracts, backend integration, live Prometheus/host/container/service metrics and Alertmanager events.
- Production loading/error/retry states, authorization, persistent alert acknowledgement/resolution and real notification actions.
- Production charting, telemetry history, data refresh semantics and end-to-end operational behavior.
- Cross-browser/device acceptance and full accessibility review beyond the prototype checks.

No backend, Docker, infrastructure configuration or API integration is part of this W03 UI work.

## Local frontend checks

From the repository root:

```powershell
npm --prefix frontend run build
npm --prefix frontend test
npm --prefix frontend run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`) and use the sidebar or the hash routes above.
