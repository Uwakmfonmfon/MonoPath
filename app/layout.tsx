import './globals.css';
import { Inter } from 'next/font/google';
import Shell from './components/layout/Shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MonoPath | The Path to Mastery',
  description: 'Synthesizing the noise of learning into a single, decisive path.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
