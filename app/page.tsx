import { redirect } from 'next/navigation';

export default function RootPage() {
  // This page will handle the root route for the Vercel domain
  // The middleware should handle routing, but this provides a fallback
  redirect('/tholattice.com');
}
