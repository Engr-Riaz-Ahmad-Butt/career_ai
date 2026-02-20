import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import TrustedBy from "@/components/sections/TrustedBy";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}

