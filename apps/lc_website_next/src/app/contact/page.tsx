'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // TODO: Implement backend submission
      setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.\n\nFor faster response, please use Discord or email.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            Contact Us
          </h1>
          <p className="text-foreground/70 text-lg">
            Have a question or need support? We&apos;re here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-foreground/10'} bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-foreground/10'} bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) {
                      setErrors({ ...errors, subject: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-foreground/10'} bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) {
                      setErrors({ ...errors, message: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-foreground/10'} bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-4 rounded-lg text-base font-semibold ${isSubmitting ? 'bg-foreground/20 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} text-white transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {/* Discord */}
              <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-accent">Discord</h3>
                    <p className="text-foreground/70 text-sm mb-3">
                      Join our community for instant support and discussions
                    </p>
                    <a
                      href="https://discord.gg/lastchaos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Join Discord Server →
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-accent">Email</h3>
                    <p className="text-foreground/70 text-sm mb-3">
                      For formal inquiries and support tickets
                    </p>
                    <a
                      href="mailto:support@lastchaos.com"
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      support@lastchaos.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-lg border border-foreground/10 bg-foreground/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⏱️</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-accent">Response Time</h3>
                    <p className="text-foreground/70 text-sm">
                      We typically respond within 24-48 hours. For urgent matters, please use Discord for faster assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="p-6 rounded-lg border border-accent/30 bg-accent/5">
                <h3 className="text-lg font-semibold mb-2 text-accent">Before You Ask</h3>
                <p className="text-foreground/70 text-sm mb-3">
                  Check our FAQ page - your question might already be answered!
                </p>
                <a
                  href="/faq"
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  View FAQ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
