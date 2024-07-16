'use client';

import { Inter } from 'next/font/google';
import './globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Menu } from '@/components/common/navbar';
import { AuthProvider } from '@/hooks/useAuthState';
import { useState } from 'react';
import { Login } from '@/components/common/login';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider setUser={setUser}>
        <html lang='en'>
          <body className={inter.className}>
            {user ? (
              <>
                <Menu />
                {children}
              </>
            ) : (
              <Login />
            )}
          </body>
        </html>
      </AuthProvider>
    </QueryClientProvider>
  );
}
