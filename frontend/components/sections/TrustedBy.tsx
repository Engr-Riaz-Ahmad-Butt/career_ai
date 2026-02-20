import { TRUSTED_UNIVERSITIES } from "@/constants";

export default function TrustedBy() {
    return (
        <section className="py-8 sm:py-12 w-full border-t border-b border-[var(--border)]">
            <div className="container mx-auto w-full max-w-6xl px-4 sm:px-8 flex items-center justify-center gap-6 sm:gap-[50px] flex-wrap">
                <div className="text-[11px] text-[var(--g4)] uppercase tracking-[0.1em] whitespace-nowrap">
                    Students from
                </div>
                <div className="flex gap-6 sm:gap-10 items-center flex-wrap justify-center">
                    {TRUSTED_UNIVERSITIES.map((uni) => (
                        <div
                            key={uni}
                            className="font-[var(--font-d)] text-xs sm:text-sm text-[var(--g4)]"
                        >
                            {uni}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
