import dynamic from 'next/dynamic';

const TipLinkLiveDashboard = dynamic(
  () => import('@/components/TipLinkLiveDashboard'),
  { ssr: false, loading: () => (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#a855f7', fontSize: '1.25rem' }}>Loading TipLink Live...</div>
    </div>
  )}
);

export default function HomePage() {
  return <TipLinkLiveDashboard />;
}
