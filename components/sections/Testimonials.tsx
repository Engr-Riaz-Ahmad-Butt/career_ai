import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
    return (
        <section id="testimonials" className="px-[60px] py-[90px]">
            <div className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
                Real Results
            </div>
            <h2 className="font-[var(--font-d)] text-[clamp(30px,3.5vw,48px)] font-extrabold tracking-[-0.03em] text-[var(--white)] leading-tight max-w-[600px]">
                Thousands hired.
                <br />
                Real stories.
            </h2>

            <div className="mt-[52px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial) => (
                    <div
                        key={testimonial.name}
                        className="bg-[var(--panel)] border border-[var(--border)] rounded-2xl p-7 relative overflow-hidden group
              transition-all duration-[400ms]
              hover:border-[rgba(59,130,246,0.4)] hover:translate-y-[-8px] hover:scale-[1.02]
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(59,130,246,0.1)]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-[400ms] pointer-events-none group-hover:opacity-100" />

                        <div className="text-[var(--orange)] text-[11px] tracking-wide mb-[10px]">
                            {testimonial.stars}
                        </div>
                        <p className="text-[13px] text-[var(--g2)] leading-relaxed italic mb-4">
                            &quot;{testimonial.quote}&quot;
                        </p>
                        <div className="flex items-center gap-[10px]">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                                style={{ background: testimonial.gradient }}
                            >
                                {testimonial.avatar}
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-[var(--white)]">
                                    {testimonial.name}
                                </div>
                                <div className="text-[10px] text-[var(--g3)]">
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                        <div className="inline-block mt-[10px] px-2 py-[2px] bg-[rgba(16,185,129,0.12)] text-[var(--green)] rounded-[3px] text-[10px] font-semibold border border-[rgba(16,185,129,0.2)]">
                            {testimonial.badge}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
