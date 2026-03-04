import type { Metadata } from 'next';
import { ReduxProvider } from './providers/ReduxProvider';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import '@/shared/styles/globals.css';
import '@/shared/styles/tokens.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Store Manager Pro',
    default: 'Store Manager Pro',
  },
  description: 'Professional store and product management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
