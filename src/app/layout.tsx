import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/app/components/main-layout';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Aarogyam - AI Health Assistant',
  description:
    'An AI-driven public health app providing symptom checking, vaccine information, health alerts, and multilingual health assistance for rural and semi-urban areas of India.',
  keywords: 'health, AI, symptom checker, vaccines, health alerts, India, rural health, Aarogyam',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
