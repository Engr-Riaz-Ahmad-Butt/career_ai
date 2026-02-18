"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // TODO: Add actual user registration logic here
    // For now, we'll just sign them in after "registration"
    
    try {
      // In production, you would:
      // 1. Create user in database
      // 2. Send verification email
      // 3. Then sign them in
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to create account. Please try again.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-20">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-[420px] relative">
          <div className="text-center mb-7">
            <span className="font-[var(--font-d)] font-extrabold text-2xl bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] bg-clip-text text-transparent">
              CareerForge AI
            </span>
          </div>

          <div className="bg-[var(--panel)] border border-[var(--border2)] rounded-[18px] p-[42px]">
            <div className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[11px] font-semibold text-[var(--green)] mb-[14px]">
              ✓ Free forever — no credit card needed
            </div>

            <h1 className="font-[var(--font-d)] text-[22px] font-extrabold text-white mb-[6px] tracking-[-0.02em]">
              Create your account
            </h1>
            <p className="text-[13px] text-[var(--g3)] mb-7">
              Join 12,400+ job seekers & students
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-[11px] w-full px-[11px] py-[11px] rounded-[9px] bg-[rgba(255,255,255,0.06)] border border-[var(--border2)] text-[var(--g1)] text-[13px] font-medium cursor-pointer transition-all duration-200 mb-[22px] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="flex items-center gap-[14px] mb-[22px]">
              <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.07)]" />
              <span className="text-[11px] text-[var(--g4)] whitespace-nowrap">
                or sign up with email
              </span>
              <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.07)]" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-[14px]">
                <label className="block text-xs font-medium text-[var(--g2)] mb-[7px]">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[var(--border2)] text-white text-[13px] outline-none transition-all duration-200 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  placeholder="Alex Johnson"
                  required
                />
              </div>

              <div className="mb-[14px]">
                <label className="block text-xs font-medium text-[var(--g2)] mb-[7px]">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[var(--border2)] text-white text-[13px] outline-none transition-all duration-200 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-[14px]">
                <label className="block text-xs font-medium text-[var(--g2)] mb-[7px]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[var(--border2)] text-white text-[13px] outline-none transition-all duration-200 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
              </div>

              <div className="px-[18px] py-3 rounded-[9px] bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.15)] mb-[14px]">
                <div className="text-[11px] font-semibold text-[var(--g3)] uppercase tracking-wider mb-[7px]">
                  Free plan includes
                </div>
                <div className="text-xs text-[var(--g2)] mb-[3px] flex items-center gap-[7px]">
                  <span className="text-[var(--green)]">✓</span> 10 AI credits / month
                </div>
                <div className="text-xs text-[var(--g2)] mb-[3px] flex items-center gap-[7px]">
                  <span className="text-[var(--green)]">✓</span> 3 ATS-optimized resumes
                </div>
                <div className="text-xs text-[var(--g2)] mb-[3px] flex items-center gap-[7px]">
                  <span className="text-[var(--green)]">✓</span> 2 cover letters per month
                </div>
                <div className="text-xs text-[var(--g2)] mb-0 flex items-center gap-[7px]">
                  <span className="text-[var(--green)]">✓</span> Live ATS score feedback
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-3 rounded-[9px] bg-gradient-to-br from-[var(--blue)] to-[var(--blue-dim)] border-none text-white font-[var(--font-d)] font-bold text-sm cursor-pointer transition-all duration-200 w-full shadow-[0_0_28px_rgba(59,130,246,0.35)] hover:translate-y-[-1px] hover:shadow-[0_4px_36px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Free Account →"}
              </button>
            </form>

            <p className="text-[10px] text-[var(--g4)] text-center mt-[10px] leading-relaxed">
              By signing up you agree to our{" "}
              <a href="#" className="text-[var(--g3)] no-underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[var(--g3)] no-underline">
                Privacy Policy
              </a>
              .
            </p>

            <p className="text-center text-xs text-[var(--g3)] mt-[22px]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--blue)] no-underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-5 flex justify-center gap-5 flex-wrap">
            <span className="text-[11px] text-[var(--g4)]">🔒 SSL encrypted</span>
            <span className="text-[11px] text-[var(--g4)]">✓ GDPR compliant</span>
            <span className="text-[11px] text-[var(--g4)]">⭐ 4.9/5 rating</span>
          </div>
        </div>
      </div>
    </>
  );
}
