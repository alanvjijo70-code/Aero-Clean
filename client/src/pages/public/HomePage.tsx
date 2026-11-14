import React, { useState } from 'react';
import { HeroSection } from '../../components/landing/HeroSection.js';
import { FlightShowcaseSection } from '../../components/landing/FlightShowcaseSection.js';
import { FeatureGrid } from '../../components/landing/FeatureGrid.js';
import { ImpactSection } from '../../components/landing/ImpactSection.js';
import { CleaningWorkflow } from '../../components/drone/CleaningWorkflow.js';
import { ComparisonSection } from '../../components/landing/ComparisonSection.js';
import { CostEstimator } from '../../components/forms/CostEstimator.js';
import { FAQSection } from '../../components/landing/FAQSection.js';
import { DemoRequestForm } from '../../components/forms/DemoRequestForm.js';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { Layers, Calculator, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(1);

  return (
    <div className="w-full space-y-24">
      {/* 1. Cinematic Hero Section with Full-Viewport 3D Drone First & Scroll-Reveal Text */}
      <HeroSection activeWorkflowStage={activeWorkflowStage} />

      {/* 2. Live Autonomous Flight Demo & Annotated Hardware Architecture */}
      <FlightShowcaseSection />

      {/* 3. Core Features Grid (Section 23) */}
      <FeatureGrid />

      {/* 3. Project Impact & Motives (Section 24) */}
      <ImpactSection />

      {/* 4. Hybrid Cleaning Advantage (Section 25) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionHeading
          badge="Four-Stage Hybrid Protocol"
          badgeIcon={Layers}
          title="Four Stages. One Unified"
          highlightText="Intelligent Cleaning System."
          subtitle="A synchronized multi-stage workflow engineered to soften, scrub, squeegee, and verify exterior facade glazing with zero human high-altitude exposure."
          className="mb-12"
        />

        <CleaningWorkflow onStageChange={(stage) => setActiveWorkflowStage(stage)} />
      </section>

      {/* 5. Traditional vs AeroClean AI Comparison */}
      <ComparisonSection />

      {/* 6. Cost & Time Calculator (Section 26) */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SectionHeading
          badge="Financial ROI Modeler"
          badgeIcon={Calculator}
          title="Calculate Your Building"
          highlightText="Maintenance Savings."
          subtitle="Simulate projected financial savings and turnaround acceleration based on your facility's square meters and elevation metrics."
          className="mb-12"
        />

        <CostEstimator />
      </section>

      {/* 7. Frequently Asked Questions */}
      <FAQSection />

      {/* 8. Demonstration Request & Enterprise Inquiry */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-24">
        <SectionHeading
          badge="Enterprise Demonstration"
          badgeIcon={ShieldCheck}
          title="Schedule an On-Site"
          highlightText="Autonomous Flight Evaluation."
          subtitle="Our robotics flight team conducts live site scans and evaluates architectural feasibility for commercial building portfolios."
          className="mb-10"
        />

        <DemoRequestForm />
      </section>
    </div>
  );
};
