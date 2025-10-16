'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToS: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      // Registration successful - redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-accent">
            Create Account
          </h1>
          <p className="text-foreground/70">
            Join thousands of players in LastChaos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg border border-foreground/10 bg-foreground/5">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Create a strong password"
              minLength={8}
              disabled={loading}
            />
            <p className="text-xs text-foreground/60 mt-1">At least 8 characters with uppercase, lowercase, and numbers</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Repeat your password"
              disabled={loading}
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToS"
              required
              checked={formData.agreeToS}
              onChange={(e) => setFormData({ ...formData, agreeToS: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-foreground/10 bg-background focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="agreeToS" className="ml-3 text-sm text-foreground/70">
              I agree to the{' '}
              <Link href="/legal/datenschutz" className="text-primary hover:text-primary-dark">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/legal/datenschutz" className="text-primary hover:text-primary-dark">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-lg text-base font-semibold bg-primary hover:bg-primary-dark text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-foreground/60">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
