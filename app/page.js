/**
 * page.js — Landing page composition root.
 *
 * This file has one job: import and sequence the landing page sections.
 * No logic, no hardcoded strings, no layout concerns live here.
 * Each import is a self-contained section from src/landing/sections/.
 */

import Navbar from "@/src/landing/sections/Navbar";
import Hero from "@/src/landing/sections/Hero";
import ProblemSection from "@/src/landing/sections/ProblemSection";
import HowItWorksSection from "@/src/landing/sections/HowItWorksSection";
import FeaturesSection from "@/src/landing/sections/FeaturesSection";
import CTASection from "@/src/landing/sections/CTASection";
import Footer from "@/src/landing/sections/Footer";


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
