import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum - LastChaos',
  description: 'Legal information and imprint for LastChaos',
};

export default function ImpressumPage() {
  return (
    <div className="py-16 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-accent">Impressum</h1>
          <p className="text-foreground/60">Legal Information</p>
        </div>
        
        <div className="space-y-8 text-foreground/80">
          <section className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2">
              <p><strong>Betreiber:</strong> LastChaos Server</p>
              <p><strong>Anschrift:</strong></p>
              <p className="ml-4">
                [Ihre Straße und Hausnummer]<br />
                [PLZ und Ort]<br />
                [Land]
              </p>
            </div>
          </section>

          <section className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Kontakt</h2>
            <div className="space-y-2">
              <p><strong>E-Mail:</strong> support@lastchaos.com</p>
              <p><strong>Discord:</strong> <a href="https://discord.gg/lastchaos" className="text-primary hover:text-primary-dark">discord.gg/lastchaos</a></p>
            </div>
          </section>

          <section className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <div className="space-y-2">
              <p>[Name des Verantwortlichen]</p>
              <p>[Anschrift]</p>
            </div>
          </section>

          <section className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Haftungsausschluss</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Haftung für Inhalte</h3>
            <p className="mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Haftung für Links</h3>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Urheberrecht</h3>
            <p className="mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">Streitschlichtung</h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark ml-1">
                https://ec.europa.eu/consumers/odr
              </a>. 
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="text-sm text-foreground/60 pt-8 border-t border-foreground/10">
            <p>
              Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">eRecht24</a>
            </p>
            <p className="mt-2">
              Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
