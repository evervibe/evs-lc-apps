"use client";

import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
  { name: "Market", href: "/market" },
  { name: "Rankings", href: "/rankings" },
  { name: "Vote", href: "/vote" },
  { name: "Redeem", href: "/redeem" },
  { name: "Downloads", href: "/downloads" },
  { name: "Support", href: "/support/tickets" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = false; // TODO: Connect to auth state

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-primary">LastChaos</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent"
                  >
                    Dashboard
                  </Link>
                  <button className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 bg-primary text-primary-foreground text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
