import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const downloads = [
  {
    id: 1,
    name: "LastChaos Game Client",
    version: "v3.0.5",
    description: "Full game client installer for Windows",
    file_size: "2.5 GB",
    download_url: "#",
  },
  {
    id: 2,
    name: "Game Launcher",
    version: "v1.2.0",
    description: "Standalone launcher with auto-update feature",
    file_size: "50 MB",
    download_url: "#",
  },
  {
    id: 3,
    name: "Patch Notes",
    version: "Latest",
    description: "View detailed changes in the latest update",
    file_size: "PDF",
    download_url: "#",
  },
];

const systemRequirements = {
  minimum: [
    "OS: Windows 7 or later",
    "Processor: Intel Core i3 or equivalent",
    "Memory: 4 GB RAM",
    "Graphics: DirectX 9 compatible GPU",
    "DirectX: Version 9.0c",
    "Network: Broadband Internet connection",
    "Storage: 5 GB available space",
  ],
  recommended: [
    "OS: Windows 10 or later",
    "Processor: Intel Core i5 or equivalent",
    "Memory: 8 GB RAM",
    "Graphics: DirectX 11 compatible GPU",
    "DirectX: Version 11",
    "Network: Broadband Internet connection",
    "Storage: 10 GB available space",
  ],
};

export default function DownloadsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Downloads</h1>
        <p className="text-muted-foreground">
          Get the game client and all necessary files to start playing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {downloads.map((download) => (
          <Card key={download.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{download.name}</CardTitle>
                <span className="text-sm text-muted-foreground">{download.version}</span>
              </div>
              <CardDescription>{download.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Size: {download.file_size}
                </span>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Minimum Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {systemRequirements.minimum.map((req, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {systemRequirements.recommended.map((req, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Installation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <p className="text-muted-foreground">Download the game client installer</p>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <p className="text-muted-foreground">Run the installer and follow the setup wizard</p>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <p className="text-muted-foreground">Launch the game and login with your account</p>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <p className="text-muted-foreground">The launcher will automatically update to the latest version</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
