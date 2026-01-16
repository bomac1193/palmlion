// Root layout for Dasham app
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dasham - African Cultural Moments',
  description: 'Discover and support African music, events, and cultural moments. Send dashes (tips) to your favorite creators in Lagos, Joburg, and Nairobi.',
  keywords: ['African music', 'tipping', 'Lagos', 'Johannesburg', 'Nairobi', 'creators', 'live events'],
  authors: [{ name: 'Dasham' }],
  openGraph: {
    title: 'Dasham - African Cultural Moments',
    description: 'Discover and support African music, events, and cultural moments.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dasham',
    description: 'African Cultural Moments',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F0F1A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
