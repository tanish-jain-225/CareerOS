import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ModalProvider } from '@/context/ModalContext';
import PageTransition from '@/components/layout/PageTransition';
import CommandPalette from '@/components/layout/CommandPalette';
import Navbar from '@/components/layout/Navbar';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import { DataProvider } from '@/context/DataContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'CareerOS | Professional Job Pipeline Management',
  description: 'Enterprise-grade job tracking, CRM, preparation modules, and portfolio management for ambitious professionals.',
  keywords: ['job tracker', 'career management', 'CRM', 'job pipeline', 'interview prep'],
  authors: [{ name: 'CareerOS' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'CareerOS | Professional Job Pipeline Management',
    description: 'Enterprise-grade job tracking, CRM, preparation modules, and portfolio management.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CareerOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerOS | Professional Job Pipeline Management',
    description: 'Enterprise-grade job tracking, CRM, preparation modules, and portfolio management.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080a10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>
              <CommandPaletteProvider>
                <DataProvider>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="content-scroll">
                      <div className="page-wrap pt-20 md:pt-10">
                        <PageTransition>
                          {children}
                        </PageTransition>
                      </div>
                    </main>
                  </div>
                  <Navbar />
                  <CommandPalette />
                </DataProvider>
              </CommandPaletteProvider>
            </ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
