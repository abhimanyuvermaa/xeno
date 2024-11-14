import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { AuthProvider } from './providers/AuthProvider';
import Providers from './providers';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM System",
  description: "Customer Relationship Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
      <AuthProvider>
        <nav className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16">
              <div className="flex space-x-4">
                <Link 
                  href="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/customers" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Customers
                </Link>
                <Link 
                  href="/segments" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Segments
                </Link>
                <Link 
                  href="/campaigns" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Campaigns
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}