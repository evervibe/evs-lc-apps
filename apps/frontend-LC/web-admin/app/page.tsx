import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">LastChaos Admin</CardTitle>
          <CardDescription>
            Administration Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Login with your administrator credentials to access the dashboard.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Login to Dashboard</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            This area is restricted to authorized personnel only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
