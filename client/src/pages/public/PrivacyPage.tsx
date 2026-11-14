import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading
          badge="Enterprise Data Protection"
          badgeIcon={ShieldCheck}
          title="Privacy Policy &"
          highlightText="Data Governance."
          subtitle="How AeroClean AI protects your facility telemetry, building geometries, and user credentials."
          className="mb-8"
        />

        <GlassCard className="p-8 space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">1. Information We Collect</h3>
            <p>
              When using the AeroClean AI platform, we collect operational data necessary to generate accurate cleaning plans and cost estimates: building name, height, facade surface area, glass specifications, and corporate contact information. We never store personal biometric data or internal tenant imagery.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">2. Aerial Telemetry & LiDAR Scans</h3>
            <p>
              LiDAR point clouds, 3D digital twins, and multispectral optical verification images are stored in encrypted, isolated customer buckets protected by PostgreSQL Row Level Security (RLS). Facade scans are used strictly to navigate waypoints and calculate optical surface cleanliness.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">3. AI Model Processing Security</h3>
            <p>
              All interactions with our Google Gemini advisory subsystem originate securely from our backend server infrastructure. No API credentials, tenant records, or proprietary structural blueprints are exposed to public client browsers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">4. Data Retention and Rights</h3>
            <p>
              Registered enterprise users retain full ownership of their building profiles and cleaning mission logs. You may request data export or permanent deletion at any time through your Enterprise Account Profile dashboard.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
};
