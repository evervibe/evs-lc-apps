import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - LastChaos',
  description: 'Privacy policy and data protection information for LastChaos',
};

export default function DatenschutzPage() {
  return (
    <div className="py-16 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-accent">Datenschutzerklärung</h1>
          <p className="text-foreground/60">Privacy Policy</p>
        </div>
        
        <div className="space-y-8 text-foreground/80">
          <section className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-semibold mb-4 text-accent">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Datenerfassung auf unserer Website</h3>
            <p className="mb-4">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            <p className="mb-4">
              <strong>Wie erfassen wir Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular oder bei der Registrierung eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">2. Hosting</h2>
            <p className="mb-4">
              Wir hosten die Inhalte unserer Website bei einem externen Dienstleister. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Datenschutz</h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist im Impressum genannt. Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="mb-4">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
            <p className="mb-4">
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">4. Datenerfassung auf unserer Website</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Server-Log-Dateien</h3>
            <p className="mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="mb-4">
              Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Kontaktformular</h3>
            <p className="mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-accent">Registrierung auf dieser Website</h3>
            <p className="mb-4">
              Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">5. Cookies</h2>
            <p className="mb-4">
              Unsere Internetseiten verwenden so genannte &quot;Cookies&quot;. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.
            </p>
            <p className="mb-4">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">6. Ihre Rechte</h2>
            <p className="mb-4">Sie haben folgende Rechte:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten</li>
              <li>Recht auf Berichtigung unrichtiger Daten</li>
              <li>Recht auf Löschung Ihrer bei uns gespeicherten Daten</li>
              <li>Recht auf Einschränkung der Datenverarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung</li>
            </ul>
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
