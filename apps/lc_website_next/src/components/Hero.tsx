'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card border-b border-primary/20">
      {/* Golden Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(234,209,159,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(234,209,159,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Golden Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-70"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center">
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6 font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block text-primary drop-shadow-[0_0_15px_rgba(234,209,159,0.5)]">Welcome to</span>
            <span className="block bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_20px_rgba(234,209,159,0.6)]">
              LastChaos
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="mx-auto max-w-2xl text-lg sm:text-xl text-text-soft mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the legendary MMORPG with enhanced features, active community, and regular updates. 
            Join thousands of players in epic battles and adventures.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/download"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold bg-gradient-to-r from-primary to-primary-dark text-background transition-all duration-200 shadow-[0_4px_16px_rgba(234,209,159,0.3)] hover:shadow-[0_6px_24px_rgba(234,209,159,0.5)] hover:scale-105 border border-primary/50"
            >
              Download Now
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-semibold border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(234,209,159,0.3)] transition-all duration-200"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]">24/7</div>
              <div className="text-sm text-text-soft uppercase tracking-wider">Online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]">1000+</div>
              <div className="text-sm text-text-soft uppercase tracking-wider">Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]">100%</div>
              <div className="text-sm text-text-soft uppercase tracking-wider">Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 drop-shadow-[0_0_10px_rgba(234,209,159,0.5)]">Weekly</div>
              <div className="text-sm text-text-soft uppercase tracking-wider">Updates</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Golden Glows */}
      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
    </section>
  );
}
