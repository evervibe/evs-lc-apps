import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download - LastChaos',
  description: 'Download the LastChaos game client and start your adventure today!',
};

export default function DownloadPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            Download Game Client
          </h1>
          <p className="text-foreground/70 text-lg">
            Get ready to embark on your epic adventure in LastChaos
          </p>
        </div>

        <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-12 text-center mb-12">
          <div className="text-6xl mb-6">📥</div>
          <h2 className="text-2xl font-semibold mb-4 text-accent">
            Download Link Coming Soon
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto mb-8">
            We are preparing the download server and client files. The download link will be available shortly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h3 className="text-xl font-semibold mb-4 text-accent">Minimum Requirements</h3>
            <ul className="space-y-2 text-foreground/70">
              <li>• <strong>OS:</strong> Windows 7 or higher</li>
              <li>• <strong>CPU:</strong> Intel Core i3 or equivalent</li>
              <li>• <strong>RAM:</strong> 2GB</li>
              <li>• <strong>GPU:</strong> DirectX 9.0c compatible</li>
              <li>• <strong>Storage:</strong> 5GB available space</li>
              <li>• <strong>Internet:</strong> Broadband connection</li>
            </ul>
          </div>

          <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h3 className="text-xl font-semibold mb-4 text-accent">Recommended Requirements</h3>
            <ul className="space-y-2 text-foreground/70">
              <li>• <strong>OS:</strong> Windows 10/11</li>
              <li>• <strong>CPU:</strong> Intel Core i5 or better</li>
              <li>• <strong>RAM:</strong> 4GB or more</li>
              <li>• <strong>GPU:</strong> Dedicated graphics with 1GB VRAM</li>
              <li>• <strong>Storage:</strong> 10GB available space</li>
              <li>• <strong>Internet:</strong> High-speed broadband</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-lg border border-accent/30 bg-accent/5">
          <h3 className="text-xl font-semibold mb-4 text-accent">Installation Instructions</h3>
          <ol className="space-y-3 text-foreground/70">
            <li><strong>1.</strong> Download the game client installer</li>
            <li><strong>2.</strong> Run the installer as administrator</li>
            <li><strong>3.</strong> Follow the installation wizard</li>
            <li><strong>4.</strong> Launch the game and create/login to your account</li>
            <li><strong>5.</strong> Start your adventure!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
