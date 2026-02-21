import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="px-[60px] py-20 max-w-[1100px] mx-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
          About CareerForge AI
        </div>
        <h1 className="font-[var(--font-d)] text-[clamp(38px,5.5vw,66px)] leading-tight tracking-[-0.03em] text-white max-w-[760px] mb-5">
          We're on a mission to
          <br />
          make talent visible.
        </h1>
        <p className="text-base text-[var(--g3)] max-w-[560px] leading-loose mb-0">
          CareerForge was born from a simple frustration: talented people losing opportunities not because of their abilities, but because of how their experience was presented on paper.
        </p>

        <div className="flex gap-12 flex-wrap mt-11">
          {[
            { num: "12,400+", label: "Resumes created" },
            { num: "84/100", label: "Avg ATS score" },
            { num: "4.9/5", label: "User rating" },
            { num: "$1.2B", label: "Market size" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-[var(--font-d)] text-[34px] text-[var(--white)] leading-none">
                {stat.num}
              </div>
              <div className="text-xs text-[var(--g3)] mt-[3px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <section className="px-[60px] py-[72px]">
        <div className="mb-11">
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
            The Team
          </div>
          <h2 className="font-[var(--font-d)] text-4xl text-[var(--white)] tracking-[-0.02em] max-w-[600px] leading-tight">
            Built by people who've been there
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1100px] mx-auto">
          {[
            {
              avatar: "AK",
              name: "Alex Kim",
              role: "Co-founder & CEO",
              desc: "Former Google SWE. Spent years watching talented people lose out on jobs because of bad resumes. Built CareerForge to fix that.",
              gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            },
            {
              avatar: "MR",
              name: "Maria Rodriguez",
              role: "Co-founder & CTO",
              desc: "AI researcher turned builder. 4 years working on LLM fine-tuning at Anthropic before co-founding CareerForge.",
              gradient: "linear-gradient(135deg,#10b981,#059669)",
            },
            {
              avatar: "JS",
              name: "Jae-won Shin",
              role: "Head of Product",
              desc: "Ex-Stripe PM. Obsessed with reducing friction. Designed every user flow in CareerForge to feel effortless.",
              gradient: "linear-gradient(135deg,#a78bfa,#7c3aed)",
            },
            {
              avatar: "LT",
              name: "Layla Thompson",
              role: "Head of Growth",
              desc: "Built 0-to-100K growth engines at two previous startups. Leads all marketing, partnerships, and community.",
              gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-[var(--panel)] border border-[var(--border)] rounded-[14px] p-6 transition-all duration-200 hover:border-[var(--border2)]"
            >
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-sm font-extrabold text-white mb-[14px]"
                style={{ background: member.gradient }}
              >
                {member.avatar}
              </div>
              <div className="font-[var(--font-d)] text-sm text-[var(--white)] mb-[3px]">
                {member.name}
              </div>
              <div className="text-[11px] text-[var(--blue)] font-semibold mb-[10px]">
                {member.role}
              </div>
              <p className="text-xs text-[var(--g3)] leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 px-8 py-7 bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.15)] rounded-[14px] flex items-center justify-between gap-4 flex-wrap max-w-[1100px] mx-auto">
          <div>
            <div className="font-[var(--font-d)] text-base text-[var(--white)] mb-1">
              We're hiring 🚀
            </div>
            <p className="text-[13px] text-[var(--g3)]">
              Looking for engineers, designers, and growth hackers who care about career equity.
            </p>
          </div>
          <button className="px-[22px] py-[10px] rounded-[9px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white font-[var(--font-d)] text-[13px] border-none cursor-pointer whitespace-nowrap">
            See Open Roles →
          </button>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-[60px] mb-20 bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(34,211,238,0.08)] border border-[rgba(59,130,246,0.25)] rounded-[22px] px-10 py-[72px] text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_60%)] pointer-events-none" />
        <h2 className="font-[var(--font-d)] text-[clamp(26px,3.5vw,44px)] tracking-[-0.03em] text-[var(--white)] mb-[14px] relative z-[1]">
          Your story deserves to be heard.
        </h2>
        <p className="text-[15px] text-[var(--g3)] mb-8 relative z-[1]">
          Let AI help you tell it — in a way that gets through every filter and lands the right job.
        </p>
        <div className="flex gap-3 justify-center flex-wrap relative z-[1]">
          <Link
            href="/auth/signup"
            className="px-[30px] py-[13px] rounded-[10px] font-[var(--font-d)] text-sm text-white bg-gradient-to-br from-[var(--blue)] to-[var(--blue-dim)] border-none cursor-pointer transition-all duration-[250ms] shadow-[0_0_40px_rgba(59,130,246,0.4)] inline-block hover:translate-y-[-2px] hover:shadow-[0_6px_50px_rgba(59,130,246,0.6)] no-underline"
          >
            Build Your Resume Free →
          </Link>
          <Link
            href="/pricing"
            className="px-[30px] py-[13px] rounded-[10px] font-[var(--font-b)] text-sm text-[var(--g2)] bg-[rgb(var(--white-rgb)/0.05)] border border-[var(--border2)] cursor-pointer transition-all duration-200 hover:bg-[rgb(var(--white-rgb)/0.1)] hover:text-[var(--white)] inline-block no-underline"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
