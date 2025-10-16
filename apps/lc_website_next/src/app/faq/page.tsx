import { Metadata } from 'next';
import Accordion from '@/components/Accordion';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions - LastChaos',
  description: 'Find answers to common questions about LastChaos, including gameplay, account management, and technical support.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Register' button in the navigation menu or on the homepage. Fill in the required information including username, email, and password. After registration, you can immediately log in and start playing."
    },
    {
      question: "Is the game free to play?",
      answer: "Yes! LastChaos is completely free to play. While we offer optional premium items in our shop to support the server, all core gameplay features are accessible to everyone without payment."
    },
    {
      question: "What are the system requirements?",
      answer: "Minimum: Windows 7 or higher, 2GB RAM, Intel Core i3 or equivalent, DirectX 9.0c compatible graphics card. Recommended: Windows 10/11, 4GB RAM, Intel Core i5 or better, dedicated graphics card with 1GB VRAM."
    },
    {
      question: "How do I download the game client?",
      answer: "Visit our Download page and click the download button. The installer will download and guide you through the setup process. Make sure to install the game in a folder with write permissions."
    },
    {
      question: "Can I play with friends?",
      answer: "Absolutely! You can create or join guilds, party up for dungeons, participate in guild wars, and compete in PvP battles together. Use our referral system to invite friends and earn rewards!"
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "Click on 'Lost your password?' on the login page. Enter your username and email address, and we'll send you instructions to reset your password via email."
    },
    {
      question: "How do rankings work?",
      answer: "Rankings are updated regularly and show the top players based on level, PvP performance, and guild achievements. Climb the leaderboards by leveling up your character and participating in PvP combat."
    },
    {
      question: "Are there regular events?",
      answer: "Yes! We host weekly events with special rewards, seasonal events, and community-driven activities. Check our news section and Discord for event announcements."
    },
    {
      question: "How can I report a bug or player?",
      answer: "Use our support ticket system available in the Contact page, or reach out to staff members on Discord. For urgent issues, you can contact administrators directly through the game's support system."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including PayPal, credit cards, and other regional payment options. All transactions are processed securely through trusted payment gateways."
    },
    {
      question: "Can I get a refund for shop purchases?",
      answer: "Due to the digital nature of our products, we generally cannot offer refunds. However, if you encounter technical issues preventing you from receiving your items, please contact support immediately."
    },
    {
      question: "How do I join a guild?",
      answer: "You can browse available guilds in-game or be invited by existing guild members. Once you reach the required level, you can also create your own guild and recruit members."
    }
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            Frequently Asked Questions
          </h1>
          <p className="text-foreground/70 text-lg">
            Find answers to the most common questions about LastChaos
          </p>
        </div>

        {/* FAQ List */}
        <Accordion items={faqs} />

        {/* Contact CTA */}
        <div className="mt-12 p-8 rounded-lg border border-accent/30 bg-accent/5 text-center">
          <h3 className="text-xl font-semibold mb-3 text-accent">
            Still have questions?
          </h3>
          <p className="text-foreground/70 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all"
            >
              Contact Support
            </a>
            <a
              href="https://discord.gg/lastchaos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg text-sm font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-background transition-all"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
