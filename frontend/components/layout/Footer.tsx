import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="px-6 md:px-[60px] py-[60px] border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-11 w-full mx-auto">
        <div>
          <div className="font-[var(--font-d)] font-extrabold text-lg bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] bg-clip-text text-transparent mb-[10px]">
            CareerForge AI
          </div>
          <p className="text-xs text-[var(--g4)] leading-relaxed max-w-[220px]">
            AI-powered career document platform for students and job seekers
            worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-[var(--white)] uppercase tracking-wider mb-[14px]">
            Product
          </h4>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Resume Builder
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            ATS Tailoring
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Cover Letters
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Scholarship Suite
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Interview Prep
          </Link>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-[var(--white)] uppercase tracking-wider mb-[14px]">
            Resources
          </h4>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            ATS Guide
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Resume Tips
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Scholarship Tips
          </Link>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-[var(--white)] uppercase tracking-wider mb-[14px]">
            Company
          </h4>
          <Link
            href="/about"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            About
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Careers
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="block text-xs text-[var(--g4)] no-underline mb-[9px] transition-colors hover:text-[var(--g3)]"
          >
            Contact
          </Link>
        </div>
      </footer>

      <div className="px-6 md:px-[60px] py-[18px] border-t border-[var(--border)] flex justify-between items-center text-[11px] text-[var(--g4)] w-full mx-auto">
        <div>© 2025 CareerForge AI. All rights reserved.</div>
        <div>
          <Link href="#" className="text-[var(--g4)] no-underline ml-4">
            Twitter
          </Link>
          <Link href="#" className="text-[var(--g4)] no-underline ml-4">
            LinkedIn
          </Link>
          <Link href="#" className="text-[var(--g4)] no-underline ml-4">
            GitHub
          </Link>
        </div>
      </div>
    </>
  );
}
