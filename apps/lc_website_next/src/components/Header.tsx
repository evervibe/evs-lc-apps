'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/20">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors font-serif">
              LastChaos
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/rankings"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Rankings
              </Link>
              <Link
                href="/news"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                News
              </Link>
              <Link
                href="/shop"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/download"
                className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-primary to-primary-dark text-background hover:shadow-[0_0_15px_rgba(234,209,159,0.4)] transition-all duration-200 border border-primary/50"
              >
                Download
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary/10 hover:text-primary focus:outline-none transition-colors"
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
          <div className="md:hidden pb-3 pt-2 border-t border-primary/20 mt-2">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/rankings"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link
                href="/news"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/shop"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/download"
                className="px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-primary to-primary-dark text-background transition-colors border border-primary/50"
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
