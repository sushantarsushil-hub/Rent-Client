import '../index.css';
import Providers from './providers';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ErrorBoundary from '../components/common/ErrorBoundary';

export const metadata = {
  title: 'Rentify - Modern Urban Property Rental & Booking Marketplace',
  description: 'Rentify is a premium real estate marketplace for browsing luxury properties, booking stays, and managing rental investments.',
  keywords: 'rentals, real estate, property booking, luxury apartments, villas, tenant portal, host owner portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900 antialiased">
      <body className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
