import React, { useState } from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { DemoRequestForm } from '../../components/forms/DemoRequestForm.js';
import { ContactForm } from '../../components/forms/ContactForm.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { PhoneCall, Building2, Mail, MapPin, ShieldCheck, Globe } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo' | 'general'>('demo');

  const offices = [
    {
      city: 'Bengaluru, India',
      role: 'Global Engineering & Robotics Lab',
      address: 'Outer Ring Road, Bellandur, Bengaluru 560103',
      contact: '+91 80 4567 8900'
    },
    {
      city: 'San Francisco, USA',
      role: 'North American Solutions Center',
      address: 'Market Street, Suite 400, San Francisco, CA 94105',
      contact: '+1 415 555 0199'
    },
    {
      city: 'Dubai, UAE',
      role: 'Middle East High-Rise Operations Hub',
      address: 'DIFC Gate Precinct 4, Dubai, UAE',
      contact: '+971 4 312 8000'
    }
  ];

  return (
    <div className="pt-24 pb-20 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Enterprise Relations & Flight Inquiries"
          badgeIcon={PhoneCall}
          title="Connect with AeroClean AI"
          highlightText="Robotics Engineering."
          subtitle="Whether you represent a 50-storey corporate tower, a hotel chain, or a facility management conglomerate, our aerospace team is ready to assist."
          className="mb-8"
        />

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'demo'
                  ? 'bg-primary text-background font-bold shadow-glow-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Schedule Flight Demo</span>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'general'
                  ? 'bg-primary text-background font-bold shadow-glow-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>General Inquiry</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="mb-16">
          {activeTab === 'demo' ? <DemoRequestForm /> : <ContactForm />}
        </div>

        {/* Global Operations Hubs */}
        <div className="pt-12 border-t border-border">
          <h4 className="text-sm font-mono uppercase tracking-widest text-primary text-center mb-8">
            Global Engineering & Deployment Hubs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((office, idx) => (
              <GlassCard key={idx} className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-primary text-sm font-bold font-display">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{office.city}</span>
                </div>
                <p className="text-xs font-mono text-accent">{office.role}</p>
                <p className="text-xs text-text-secondary">{office.address}</p>
                <p className="text-xs font-mono text-text-muted pt-2">{office.contact}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
