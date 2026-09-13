import { OfferLeadCapture } from '@/components/offer-lead-capture';

export default async function OfferLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <>{children}<OfferLeadCapture slug={slug} /></>;
}
