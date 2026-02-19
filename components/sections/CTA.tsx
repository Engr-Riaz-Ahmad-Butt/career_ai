import Link from "next/link";

export default function CTA() {
    return (
        <div className="mx-[60px] mb-[90px] bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(34,211,238,0.08)] border border-[rgba(59,130,246,0.25)] rounded-[22px] px-10 py-[72px] text-center relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_60%)] pointer-events-none" />
            <h2 className="font-[var(--font-d)] text-[clamp(26px,3.5vw,44px)] font-extrabold tracking-[-0.03em] text-[var(--white)] mb-[14px] relative z-[1]">
                Your next job starts today.
            </h2>
            <p className="text-[15px] text-[var(--g3)] mb-8 relative z-[1]">
                Join 12,000+ job seekers and students who&apos;ve upgraded their career
                documents with AI.
            </p>
            <div className="flex gap-3 justify-center flex-wrap relative z-[1]">
                <Link
                    href="/auth/signup"
                    className="px-[30px] py-[13px] rounded-[10px] font-[var(--font-d)] font-bold text-sm text-white bg-gradient-to-br from-[var(--blue)] to-[var(--blue-dim)] border-none cursor-pointer transition-all duration-[250ms] shadow-[0_0_40px_rgba(59,130,246,0.4)] inline-block hover:translate-y-[-2px] hover:shadow-[0_6px_50px_rgba(59,130,246,0.6)]"
                >
                    Create Your Free Resume →
                </Link>
                <button className="px-[30px] py-[13px] rounded-[10px] font-[var(--font-b)] font-medium text-sm text-[var(--g2)] bg-[rgba(255,255,255,0.05)] border border-[var(--border2)] cursor-pointer transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:text-white">
                    See All Features
                </button>
            </div>
        </div>
    );
}
