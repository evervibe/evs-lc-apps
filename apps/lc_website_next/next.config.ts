import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline for dev/hydration
      "style-src 'self' 'unsafe-inline'", // Tailwind and other inline styles
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    
    if (isProd) {
      cspDirectives.push("upgrade-insecure-requests");
    }
    
    const csp = cspDirectives.join('; ');
    
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: csp,
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
    ];
    
    // Add HSTS only in production
    if (isProd) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }
    
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
