import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-md p-4">{children}</main>
      </body>
    </html>
  );
}
