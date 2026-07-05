import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'OwnRewards — Customer Portal',
  description: 'Your exclusive rewards portal. View points, coupons, offers, purchase history, and more.',
  keywords: 'rewards, loyalty, coupons, offers, OwnRewards',
  authors: [{ name: 'OwnRewards' }],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'OwnRewards Customer Portal',
    description: 'Manage your rewards, coupons, and exclusive offers',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
