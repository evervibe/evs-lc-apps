'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GameServer {
  id: string;
  name: string;
  region?: string;
  driver: string;
  host: string;
  port: number;
  database: string;
  createdAt: string;
}

export default function ServersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<GameServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    host: '',
    port: '3306',
    database: 'db_auth',
    roUser: '',
    roPassword: '',
  });
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/account');
    }
  }, [status, session, router]);

  // Load servers
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      loadServers();
    }
  }, [status, session]);

  const loadServers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/servers');
      if (response.ok) {
        const data = await response.json();
        setServers(data.servers || []);
      }
    } catch (err) {
      console.error('Failed to load servers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          region: formData.region || null,
          host: formData.host,
          port: parseInt(formData.port, 10),
          database: formData.database,
          roUser: formData.roUser,
          roPassword: formData.roPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to add server');
        return;
      }

      // Success - reload servers and reset form
      await loadServers();
      setShowAddForm(false);
      setFormData({
        name: '',
        region: '',
        host: '',
        port: '3306',
        database: 'db_auth',
        roUser: '',
        roPassword: '',
      });
      setAdminToken('');
    } catch (err) {
      setError('An error occurred while adding server');
      console.error('Add server error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="py-16 text-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-accent">
            Game Server Management
          </h1>
          <p className="text-foreground/70">
            Configure game database connections for account linking
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add New Server'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg border border-foreground/10 bg-foreground/5">
            <h2 className="text-2xl font-bold mb-4">Add Game Server</h2>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Server Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Main Server"
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., EU, US, Asia"
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Database Host *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., localhost or 192.168.1.100"
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Port *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="3306"
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Database Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., db_auth"
                  disabled={submitLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Read-Only Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roUser}
                    onChange={(e) => setFormData({ ...formData, roUser: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="readonly_user"
                    disabled={submitLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Read-Only Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.roPassword}
                    onChange={(e) => setFormData({ ...formData, roPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Database password"
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                <p className="text-sm text-foreground/70 mb-3">
                  <strong>⚠ Admin Token Required</strong>
                </p>
                <label className="block text-sm font-medium mb-2">
                  Admin Token *
                </label>
                <input
                  type="password"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter ADMIN_TOKEN from .env"
                  disabled={submitLoading}
                />
                <p className="text-xs text-foreground/60 mt-1">
                  This token is configured in the server&apos;s environment variables.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Adding Server...' : 'Add Server'}
              </button>
            </div>
          </form>
        )}

        <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
          <h2 className="text-2xl font-bold mb-4">Configured Servers</h2>
          
          {servers.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">
              No servers configured yet. Click &quot;Add New Server&quot; to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className="p-4 rounded-lg border border-foreground/10 bg-background"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{server.name}</h3>
                      {server.region && (
                        <p className="text-sm text-foreground/60">{server.region}</p>
                      )}
                      <p className="text-sm text-foreground/60 mt-2">
                        <strong>Host:</strong> {server.host}:{server.port}
                      </p>
                      <p className="text-sm text-foreground/60">
                        <strong>Database:</strong> {server.database}
                      </p>
                      <p className="text-xs text-foreground/50 mt-2">
                        Added: {new Date(server.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-lg border border-accent/30 bg-accent/5">
          <h3 className="font-semibold mb-2">Security Notes</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• Only configure read-only database credentials</li>
            <li>• Passwords are encrypted at rest in the database</li>
            <li>• All game account link attempts are audited</li>
            <li>• Admin token must match the ADMIN_TOKEN environment variable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
