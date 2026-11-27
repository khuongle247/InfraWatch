export default function getDashboardPage(hash) {
  const page = hash.replace(/^#\/?/, '').split('/')[0];
  const pages = ['overview', 'hosts', 'containers', 'services', 'alerts'];
  return pages.includes(page) ? page : 'overview';
}
