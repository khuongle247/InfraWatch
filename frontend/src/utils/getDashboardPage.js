export default function getDashboardPage(hash) {
  return hash.replace(/^#\/?/, '').split('/')[0] === 'hosts' ? 'hosts' : 'overview';
}
