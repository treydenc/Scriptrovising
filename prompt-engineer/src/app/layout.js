// src/app/layout.js
import Header from '@/components/header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gradient-to-b from-black to-gray-900">
        <Header />
        {children}
      </body>
    </html>
  );
}