import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Section */}
          <div>
            <h3 className="text-accent font-semibold text-sm uppercase mb-4 tracking-wider">
              Main
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/market" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Invite Friends
                </Link>
              </li>
              <li>
                <Link href="/vote" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Vote Rewards
                </Link>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Forum
                </a>
              </li>
              <li>
                <Link href="/support/tickets" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* How to Start Section */}
          <div>
            <h3 className="text-accent font-semibold text-sm uppercase mb-4 tracking-wider">
              How to Start
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Download
                </Link>
              </li>
              <li>
                <Link href="/support/tickets" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Ranking Section */}
          <div>
            <h3 className="text-accent font-semibold text-sm uppercase mb-4 tracking-wider">
              Ranking
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rankings?tab=players" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Players
                </Link>
              </li>
              <li>
                <Link href="/rankings?tab=guilds" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Guilds
                </Link>
              </li>
              <li>
                <Link href="/rankings?tab=pvp" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  PVP
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-accent font-semibold text-sm uppercase mb-4 tracking-wider">
              Contact
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-foreground/70 text-sm mb-2">Discord Channel:</p>
                <a 
                  href="https://discord.gg/lastchaos" 
                  className="text-primary hover:text-primary-dark transition-colors text-sm break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Our Discord
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://discord.gg/lastchaos"
                  className="text-foreground/70 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  className="text-foreground/70 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  className="text-foreground/70 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-foreground/60 text-sm text-center md:text-left">
              <p>Copyright 2025 &copy; LastChaos</p>
              <p className="mt-1">Powered by Next.js 15 & TailwindCSS</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm justify-center">
              <Link href="/legal/impressum" className="text-foreground/70 hover:text-foreground transition-colors">
                Impressum
              </Link>
              <Link href="/legal/datenschutz" className="text-foreground/70 hover:text-foreground transition-colors">
                Datenschutz
              </Link>
              <Link href="/support/tickets" className="text-foreground/70 hover:text-foreground transition-colors">
                FAQ
              </Link>
              <a href="/docs/CHANGELOG.md" className="text-foreground/70 hover:text-foreground transition-colors">
                Changelog
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
