import dynamic from "next/dynamic";

import Hero from "@/components/sections/Hero";

const TrustedBy = dynamic(() => import("@/components/sections/TrustedBy"));
const Features = dynamic(() => import("@/components/sections/Features"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <CTA />
    </>
  );
}

