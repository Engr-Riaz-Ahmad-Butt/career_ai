"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Reviews", href: "/#testimonials" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[60px] py-4 bg-[rgb(var(--black-rgb)/0.8)] backdrop-blur-[24px] backdrop-saturate-[180%] border-b border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(59,130,246,0.03)] to-[rgba(34,211,238,0.02)] pointer-events-none" />

      <Link
        href="/"
        className="relative z-[1] font-[var(--font-d)] font-bold text-[22px] bg-gradient-to-r from-[#60a5fa] via-[#22d3ee] to-[#10b981] bg-clip-text text-transparent cursor-pointer tracking-[-0.5px] transition-all duration-300 hover:translate-y-[-1px] hover:brightness-120"
      >
        CareerForge AI
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center relative z-[1]">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`text-sm font-medium tracking-[-0.01em] transition-all duration-200 relative px-1 py-2 group ${pathname === link.href ? "text-[var(--white)]" : "text-[var(--g3)]"
              }`}
          >
            {link.name}
            <span
              className={`absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] rounded-[2px] transition-transform duration-300 ${pathname === link.href ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100`}
            />
          </Link>
        ))}
      </div>

      <div className="hidden md:flex gap-[10px] items-center relative z-[1]">
        <ThemeToggle />
        <Link
          href="/auth/login"
          className="px-6 py-[10px] rounded-[10px] text-sm font-medium text-[var(--g2)] bg-[rgb(var(--white-rgb)/0.05)] border border-[var(--border2)] cursor-pointer transition-all duration-300 relative overflow-hidden z-[1] hover:bg-[rgb(var(--blue-rgb)/0.1)] hover:text-[var(--white)] hover:border-[rgb(var(--blue-rgb)/0.4)] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgb(var(--blue-rgb)/0.1)] before:to-[rgba(34,211,238,0.1)] before:opacity-0 before:transition-opacity before:duration-300 before:z-[-1] hover:before:opacity-100"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="px-[26px] py-[10px] rounded-[10px] text-sm font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#2563eb] border-none cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.4)] relative overflow-hidden hover:translate-y-[-3px] hover:shadow-[0_8px_28px_rgba(59,130,246,0.6)] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#60a5fa] before:to-[#3b82f6] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
        >
          Get Started Free
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden z-[1] text-[var(--white)]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--panel)] border-b border-[var(--border)] p-4 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="text-xs font-semibold text-[var(--g3)] uppercase tracking-wider">Theme</span>
              <ThemeToggle />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[var(--g3)] hover:text-[var(--white)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-center text-[var(--g2)] bg-[rgb(var(--white-rgb)/0.05)] border border-[var(--border2)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-center text-white bg-gradient-to-br from-[#3b82f6] to-[#2563eb]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
