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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-accent">
              Why Choose LastChaos?
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Experience the ultimate MMORPG adventure with cutting-edge features and an active community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Epic PvP Battles</h3>
              <p className="text-foreground/70">
                Engage in intense player-versus-player combat. Test your skills in arenas and guild wars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">🏰</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Guild System</h3>
              <p className="text-foreground/70">
                Create or join powerful guilds. Conquer territories and dominate the realm together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Regular Events</h3>
              <p className="text-foreground/70">
                Participate in weekly events with exclusive rewards and special gameplay experiences.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Custom Content</h3>
              <p className="text-foreground/70">
                Enjoy exclusive custom items, dungeons, and features not found in other servers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Global Community</h3>
              <p className="text-foreground/70">
                Join players from around the world. Multi-language support and active forums.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:border-accent/30">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Fair Play</h3>
              <p className="text-foreground/70">
                Active anti-cheat system and dedicated staff ensure a fair gaming environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-foreground/5 border-y border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-accent">
              Trusted by Thousands
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Join our growing community of dedicated players from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-background hover:border-accent/30 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-accent">DragonSlayer</div>
                  <div className="text-sm text-foreground/60">Level 180 Knight</div>
                </div>
              </div>
              <p className="text-foreground/70 italic">
                &quot;Best LastChaos server I&apos;ve played on! The community is amazing and the events are always exciting.&quot;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-background hover:border-accent/30 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-accent">MysticMage</div>
                  <div className="text-sm text-foreground/60">Level 165 Mage</div>
                </div>
              </div>
              <p className="text-foreground/70 italic">
                &quot;Active staff, regular updates, and fair gameplay. This is the server LastChaos deserves!&quot;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-lg border border-foreground/10 bg-background hover:border-accent/30 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-accent">ShadowRogue</div>
                  <div className="text-sm text-foreground/60">Level 175 Rogue</div>
                </div>
              </div>
              <p className="text-foreground/70 italic">
                &quot;The PvP system is balanced and the guild wars are intense. Highly recommend!&quot;
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🛡️</div>
              <div className="text-sm font-semibold text-accent">Anti-Cheat</div>
              <div className="text-xs text-foreground/60">Protected</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-sm font-semibold text-accent">99.9% Uptime</div>
              <div className="text-xs text-foreground/60">Reliable</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-sm font-semibold text-accent">5+ Years</div>
              <div className="text-xs text-foreground/60">Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">🌍</div>
              <div className="text-sm font-semibold text-accent">Global</div>
              <div className="text-xs text-foreground/60">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/80 border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-accent">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-foreground/70 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of players in the world of LastChaos. Download the game and create your account today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/download"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold bg-primary hover:bg-primary-dark text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Download Client
            </Link>
            <Link
              href="/rankings"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold border-2 border-foreground/20 hover:border-accent hover:bg-foreground/5 transition-all duration-200"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
