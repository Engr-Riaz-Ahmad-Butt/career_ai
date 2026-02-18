import { HOW_IT_WORKS_STEPS } from "@/constants";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-[60px] py-[90px] text-center">
            <div className="inline-block text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--blue)] mb-[14px]">
                Simple Process
            </div>
            <h2 className="font-[var(--font-d)] text-[clamp(30px,3.5vw,48px)] font-extrabold tracking-[-0.03em] text-white leading-tight mx-auto">
                From signup to hired — in 4 steps
            </h2>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative text-left">
                {/* Connection line */}
                <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent" />

                {HOW_IT_WORKS_STEPS.map((step) => (
                    <div key={step.num} className="px-4">
                        <div
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                "font-[var(--font-d)] text-base font-extrabold mx-auto mb-5",
                                "relative z-[1] bg-gradient-to-br border",
                                step.gradient,
                                step.border,
                                step.color
                            )}
                        >
                            {step.num}
                        </div>
                        <h4 className="font-[var(--font-d)] text-sm font-bold text-white mb-[7px]">
                            {step.title}
                        </h4>
                        <p className="text-xs text-[var(--g3)] leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
