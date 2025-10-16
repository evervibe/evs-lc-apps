'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface GameAccountLink {
  id: string;
  gameUsername: string;
  server: {
    id: string;
    name: string;
    region?: string;
  };
  verifiedAt: string | null;
  lastCheckAt: string | null;
}

interface GameServer {
  id: string;
  name: string;
  region?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameLinks, setGameLinks] = useState<GameAccountLink[]>([]);
  const [servers, setServers] = useState<GameServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkForm, setLinkForm] = useState({
    serverId: '',
    gameUsername: '',
    gamePassword: '',
  });
  const [error, setError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load game account links and servers
  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load game links
      const linksRes = await fetch('/api/game/links');
      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setGameLinks(linksData.links || []);
      }

      // Load available servers
      const serversRes = await fetch('/api/servers');
      if (serversRes.ok) {
        const serversData = await serversRes.json();
        setServers(serversData.servers || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLinkLoading(true);

    try {
      const response = await fetch('/api/game/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: linkForm.serverId,
          gameUsername: linkForm.gameUsername,
          gamePassword: linkForm.gamePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to link account');
        return;
      }

      // Success - reload links and reset form
      await loadData();
      setShowLinkForm(false);
      setLinkForm({
        serverId: '',
        gameUsername: '',
        gamePassword: '',
      });
    } catch (err) {
      setError('An error occurred while linking account');
      console.error('Link error:', err);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleUnlinkAccount = async (linkId: string) => {
    if (!confirm('Are you sure you want to unlink this game account?')) {
      return;
    }

    try {
      const response = await fetch(`/api/game/links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
      } else {
        alert('Failed to unlink account');
      }
    } catch (err) {
      console.error('Unlink error:', err);
      alert('An error occurred while unlinking account');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="py-16 text-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-accent">
            Account Management
          </h1>
          <p className="text-foreground/70">
            Manage your portal account and linked game accounts
          </p>
        </div>

        {/* User Info */}
        <div className="mb-8 p-6 rounded-lg border border-foreground/10 bg-foreground/5">
          <h2 className="text-2xl font-bold mb-4">Portal Account</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Role:</strong> {session.user?.role || 'user'}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Game Account Links */}
        <div className="mb-8 p-6 rounded-lg border border-foreground/10 bg-foreground/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Linked Game Accounts</h2>
            <button
              onClick={() => setShowLinkForm(!showLinkForm)}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              {showLinkForm ? 'Cancel' : 'Link New Account'}
            </button>
          </div>

          {showLinkForm && (
            <form onSubmit={handleLinkAccount} className="mb-6 p-4 rounded-lg border border-accent/30 bg-accent/5">
              <h3 className="text-lg font-semibold mb-4">Link Game Account</h3>
              
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Game Server *
                  </label>
                  <select
                    required
                    value={linkForm.serverId}
                    onChange={(e) => setLinkForm({ ...linkForm, serverId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={linkLoading}
                  >
                    <option value="">Select a server...</option>
                    {servers.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.name} {server.region && `(${server.region})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Game Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={linkForm.gameUsername}
                    onChange={(e) => setLinkForm({ ...linkForm, gameUsername: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your in-game username"
                    disabled={linkLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Game Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={linkForm.gamePassword}
                    onChange={(e) => setLinkForm({ ...linkForm, gamePassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your in-game password"
                    disabled={linkLoading}
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Your password is only used for verification and is not stored.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={linkLoading}
                  className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linkLoading ? 'Linking...' : 'Link Account'}
                </button>
              </div>
            </form>
          )}

          {gameLinks.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">
              No game accounts linked yet. Click &quot;Link New Account&quot; to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {gameLinks.map((link) => (
                <div
                  key={link.id}
                  className="p-4 rounded-lg border border-foreground/10 bg-background flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{link.gameUsername}</p>
                    <p className="text-sm text-foreground/60">
                      {link.server.name} {link.server.region && `(${link.server.region})`}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                      {link.verifiedAt ? (
                        <span className="text-green-500">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-500">⚠ Pending verification</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnlinkAccount(link.id)}
                    className="px-3 py-1 rounded text-sm bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    Unlink
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MFA Section */}
        <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
          <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
          <p className="text-foreground/60 mb-4">
            Add an extra layer of security to your account with TOTP 2FA.
          </p>
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-foreground/10 text-foreground/50 cursor-not-allowed"
          >
            Configure MFA (Coming Soon)
          </button>
        </div>

        {/* Admin Link */}
        {session.user?.role === 'admin' && (
          <div className="mt-8 p-4 rounded-lg border border-accent/30 bg-accent/5">
            <p className="text-sm">
              <strong>Admin:</strong>{' '}
              <Link href="/servers" className="text-primary hover:text-primary-dark">
                Manage Game Servers
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
