import React from 'react';
import { HeroSection } from '../components/blocks/hero-section';
import { Icons } from '../components/ui/icons';
import { Feature } from '../components/ui/feature';
import { FooterSection } from '../components/ui/footer-section';
import { Navbar } from '../components/ui/navbar';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="w-full pt-10">
        <Navbar />
      </div>
      <HeroSection
        badge={{
          text: "✨ Personal AI powered mentor",
          action: {
            text: "Learn more",
            href: "#features"
          }
        }}
        title="Omira"
        description="Experience the future of personal well-being with AI-powered health tracking and conversation analysis."
        actions={[
          {
            text: "Get Started",
            href: "/signup",
            variant: "glow",
            icon: <ArrowRight className="h-4 w-4" />
          },
          {
            text: "Learn More",
            href: "#features",
            variant: "default"
          }
        ]}
      />
      <Feature />
      <FooterSection />
    </div>
  );
} 