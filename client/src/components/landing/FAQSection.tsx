import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the drone navigate high-wind microclimates near skyscrapers?',
      a: 'The AeroClean AI drone employs real-time wind telemetry via localized ultrasonic anemometers and an onboard 6-axis IMU. If gusts exceed the pre-calibrated safety envelope (typically 28 km/h or 15 knots depending on facade geometry), the flight control system automatically holds position or initiates a soft tethered return to the rooftop station.'
    },
    {
      q: 'What prevents the drone from colliding with the glass facade?',
      a: 'A triple-redundant collision avoidance system integrates 360-degree high-frequency LiDAR, ultrasonic ranging sensors, and optical stereo cameras. The flight firmware enforces an immutable 15cm buffered standoff distance from glass surfaces and automatically stops forward thrust if any unexpected obstruction (such as an open casement window) is detected.'
    },
    {
      q: 'How are cleaning liquid and power supplied during long missions?',
      a: 'AeroClean AI operates using either high-density quick-swap solid-state battery packs (35-minute continuous mission cycles) or a lightweight, Kevlar-reinforced umbilical tether that delivers continuous deionized surfactant fluid and high-voltage DC power from a rooftop or ground staging module.'
    },
    {
      q: 'What kind of cleaning solution is used on architectural glass coatings?',
      a: 'The platform utilizes ultra-pure deionized reverse-osmosis water blended with an environmentally benign, biodegradable surfactant. This solution creates zero mineral stains and is completely safe for low-E films, reflective solar coatings, and silicon weather-seal gaskets.'
    },
    {
      q: 'What regulatory clearances are required to deploy autonomous drones on commercial buildings?',
      a: 'Operations require site-specific flight authorizations from local civil aviation authorities (such as DGCA, FAA Part 107 waiver, or GCAA depending on jurisdiction). AeroClean AI includes ground exclusion zone protocols, dual parachutes, and physical tether fail-safes designed to meet enterprise compliance standards.'
    },
    {
      q: 'Can the drone clean complex geometries like curved facades or overhangs?',
      a: 'Yes. Prior to the maiden wash cycle, our engineers generate a high-density 3D digital twin scan of the building envelope. Autonomous path planning models dynamically trace non-planar contours, curved glazing, and architectural fins.'
    }
  ];

  return (
    <section className="py-20 relative bg-background-secondary/40 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Frequently Asked Questions"
          badgeIcon={HelpCircle}
          title="Technical & Operational"
          highlightText="Clarity."
          subtitle="Everything facility directors, building owners, and safety engineers need to know about autonomous facade maintenance."
          className="mb-12"
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <GlassCard
                key={idx}
                className="p-5 cursor-pointer transition-all border-border hover:border-primary/40"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-base font-display font-semibold text-text-primary">
                    {faq.q}
                  </h4>
                  <div className="p-1 rounded-lg text-primary bg-primary/10 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isOpen && (
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed pt-3 border-t border-border animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
