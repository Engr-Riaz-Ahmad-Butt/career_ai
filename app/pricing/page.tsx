import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      desc: "Try at no cost",
      price: "$0",
      period: "Forever, no card needed",
      features: [
        { text: "10 credits/mo", enabled: true },
        { text: "3 resumes", enabled: true },
        { text: "ATS scoring", enabled: true },
        { text: "Scholarship suite", enabled: false },
      ],
      cta: "Get Started Free",
      href: "/auth/signup",
      featured: false,
    },
    {
      name: "Pro",
      desc: "For serious job seekers",
      price: "$8",
      period: "Billed annually",
      features: [
        { text: "200 credits/mo", enabled: true, bold: true },
        { text: "Unlimited resumes", enabled: true },
        { text: "All 12 document types", enabled: true },
        { text: "Scholarship suite", enabled: true, bold: true },
        { text: "Interview prep AI", enabled: true },
      ],
      cta: "Start 7-Day Free Trial",
      href: "/auth/signup",
      featured: true,
    },
    {
      name: "Team",
      desc: "Career centers & bootcamps",
      price: "$39",
      period: "5 seats · billed annually",
      features: [
        { text: "500 shared credits", enabled: true },
        { text: "Everything in Pro", enabled: true },
        { text: "Admin dashboard", enabled: true },
        { text: "University branding", enabled: true },
      ],
      cta: "Contact Sales",
      href: "#",
      featured: false,
    },
    {
      name: "Enterprise",
      desc: "Universities & large orgs",
      price: "Custom",
      period: "Custom contract",
      features: [
        { text: "Unlimited credits", enabled: true },
        { text: "Everything in Team", enabled: true },
        { text: "Dedicated manager", enabled: true },
        { text: "SSO / SAML", enabled: true },
      ],
      cta: "Talk to Sales",
      href: "#",
      featured: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <div className="px-[60px] py-20 text-center relative overflow-hidden">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
            Simple Pricing
          </div>
          <h1 className="font-[var(--font-d)] text-[clamp(38px,5.5vw,66px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-[14px]">
            Start free.
            <br />
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] bg-clip-text text-transparent">
              Scale when you&apos;re ready.
            </span>
          </h1>
          <p className="text-base text-[var(--g3)] max-w-[480px] mx-auto leading-relaxed">
            No credit card required. Cancel anytime. 7-day free trial on Pro.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1140px] mx-auto text-left">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-[var(--panel)] border rounded-[18px] p-8 relative transition-all duration-[400ms] overflow-hidden ${
                  plan.featured
                    ? "border-[var(--blue)] bg-[rgba(59,130,246,0.05)] shadow-[0_0_60px_rgba(59,130,246,0.15)] scale-105 hover:translate-y-[-8px] hover:scale-[1.07] hover:shadow-[0_20px_80px_rgba(59,130,246,0.3)]"
                    : "border-[var(--border)] hover:translate-y-[-8px] hover:scale-[1.02] hover:border-[rgba(59,130,246,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {plan.featured && (
                  <div className="absolute top-[-11px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[10px] font-bold px-3 py-[3px] rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="font-[var(--font-d)] text-[15px] font-bold text-white mb-[5px]">
                  {plan.name}
                </div>
                <div className="text-xs text-[var(--g3)] mb-5">{plan.desc}</div>

                <div className="flex items-baseline gap-1 mb-[5px]">
                  <div className="font-[var(--font-d)] text-[40px] font-extrabold text-white">
                    {plan.price}
                  </div>
                  {plan.price !== "Custom" && (
                    <div className="text-[13px] text-[var(--g3)]">/month</div>
                  )}
                </div>
                <div className="text-[11px] text-[var(--g3)] mb-[22px]">
                  {plan.period}
                </div>

                <div className="h-[1px] bg-[var(--border)] my-4" />

                {plan.features.map((feature, j) => (
                  <div
                    key={j}
                    className="text-xs text-[var(--g2)] mb-[9px] flex items-start gap-[9px]"
                  >
                    <span
                      className={`flex-shrink-0 ${
                        feature.enabled ? "text-[var(--green)]" : "text-[var(--g4)]"
                      }`}
                    >
                      {feature.enabled ? "✓" : "✗"}
                    </span>
                    <span
                      className={
                        !feature.enabled
                          ? "text-[var(--g4)]"
                          : feature.bold
                          ? "text-white font-bold"
                          : ""
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}

                <Link
                  href={plan.href}
                  className={`block w-full px-[11px] py-[11px] rounded-[9px] font-[var(--font-d)] font-bold text-[13px] text-center cursor-pointer border-none transition-all duration-200 mt-6 no-underline ${
                    plan.featured
                      ? "bg-gradient-to-br from-[var(--blue)] to-[var(--blue-dim)] text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)]"
                      : "bg-[rgba(255,255,255,0.05)] text-[var(--g2)] border border-[var(--border2)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
