import Hero from "@/components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary font-serif">
              Why Choose LastChaos?
            </h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">
              Experience the ultimate MMORPG adventure with cutting-edge features and an active community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Epic PvP Battles</h3>
              <p className="text-text-soft">
                Engage in intense player-versus-player combat. Test your skills in arenas and guild wars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">🏰</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Guild System</h3>
              <p className="text-text-soft">
                Create or join powerful guilds. Conquer territories and dominate the realm together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Regular Events</h3>
              <p className="text-text-soft">
                Participate in weekly events with exclusive rewards and special gameplay experiences.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Custom Content</h3>
              <p className="text-text-soft">
                Enjoy exclusive custom items, dungeons, and features not found in other servers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Global Community</h3>
              <p className="text-text-soft">
                Join players from around the world. Multi-language support and active forums.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-card hover:bg-card hover:border-primary/40 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)]">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Fair Play</h3>
              <p className="text-text-soft">
                Active anti-cheat system and dedicated staff ensure a fair gaming environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card border-y border-primary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary font-serif">
              Trusted by Thousands
            </h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">
              Join our growing community of dedicated players from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-background hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl border border-primary/30">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">DragonSlayer</div>
                  <div className="text-sm text-text-soft">Level 180 Knight</div>
                </div>
              </div>
              <p className="text-text-soft italic">
                &quot;Best LastChaos server I&apos;ve played on! The community is amazing and the events are always exciting.&quot;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-background hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl border border-accent/30">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">MysticMage</div>
                  <div className="text-sm text-text-soft">Level 165 Mage</div>
                </div>
              </div>
              <p className="text-text-soft italic">
                &quot;Active staff, regular updates, and fair gameplay. This is the server LastChaos deserves!&quot;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-lg border border-primary/20 bg-background hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(234,209,159,0.2)] transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl border border-primary/30">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-primary">ShadowRogue</div>
                  <div className="text-sm text-text-soft">Level 175 Rogue</div>
                </div>
              </div>
              <p className="text-text-soft italic">
                &quot;The PvP system is balanced and the guild wars are intense. Highly recommend!&quot;
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🛡️</div>
              <div className="text-sm font-semibold text-primary">Anti-Cheat</div>
              <div className="text-xs text-text-soft">Protected</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-sm font-semibold text-primary">99.9% Uptime</div>
              <div className="text-xs text-text-soft">Reliable</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-sm font-semibold text-primary">5+ Years</div>
              <div className="text-xs text-text-soft">Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-sm font-semibold text-primary">Global</div>
              <div className="text-xs text-text-soft">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card border-t border-primary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary font-serif">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-text-soft text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of players in the world of LastChaos. Download the game and create your account today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/download"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold bg-gradient-to-r from-primary to-primary-dark text-background transition-all duration-200 shadow-[0_4px_16px_rgba(234,209,159,0.3)] hover:shadow-[0_6px_24px_rgba(234,209,159,0.5)] hover:scale-105 border border-primary/50"
            >
              Download Client
            </Link>
            <Link
              href="/rankings"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(234,209,159,0.3)] transition-all duration-200"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
