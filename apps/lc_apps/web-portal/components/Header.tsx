'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-foreground/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-accent hover:text-accent/80 transition-colors">
              LastChaos
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/rankings"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                Rankings
              </Link>
              <Link
                href="/news"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                News
              </Link>
              <Link
                href="/market"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/support/tickets"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-foreground/10 transition-colors"
              >
                Support
              </Link>
              <Link
                href="/downloads"
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                Download
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-foreground/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/rankings"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link
                href="/news"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/market"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/support/tickets"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                href="/downloads"
                className="px-3 py-2 rounded-md text-base font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Download
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
