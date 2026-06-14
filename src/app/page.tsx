import dynamic from 'next/dynamic';

const TipLinkLiveDashboard = dynamic(
  () => import('@/components/TipLinkLiveDashboard'),
  { ssr: false }
);

export default function Home() {
  return <TipLinkLiveDashboard />;
}
