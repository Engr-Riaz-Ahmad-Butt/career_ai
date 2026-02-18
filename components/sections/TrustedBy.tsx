import { TRUSTED_UNIVERSITIES } from "@/constants";

export default function TrustedBy() {
    return (
        <div className="px-[60px] py-9 border-t border-b border-[var(--border)] flex items-center justify-center gap-[50px] flex-wrap">
            <div className="text-[11px] text-[var(--g4)] uppercase tracking-[0.1em] whitespace-nowrap">
                Students from
            </div>
            <div className="flex gap-10 items-center flex-wrap justify-center">
                {TRUSTED_UNIVERSITIES.map((uni) => (
                    <div
                        key={uni}
                        className="font-[var(--font-d)] text-sm font-bold text-[var(--g4)]"
                    >
                        {uni}
                    </div>
                ))}
            </div>
        </div>
    );
}
