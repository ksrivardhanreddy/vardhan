import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import favicon from '/favicon.ico';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Vardhan Portfolio",
  description: "Welcome to my portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><link rel="icon" href={favicon.src} /></head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}