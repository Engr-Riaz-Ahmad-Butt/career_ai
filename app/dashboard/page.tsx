"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--black)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--g3)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--black)]">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-[224px] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col overflow-y-auto z-50">
        <div className="px-[18px] pt-5 pb-[14px] border-b border-[var(--border)]">
          <div className="font-[var(--font-d)] font-extrabold text-lg bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] bg-clip-text text-transparent">
            CareerForge
            <span className="inline-block ml-[5px] bg-[rgba(59,130,246,0.15)] text-[var(--blue)] text-[8px] font-bold px-[5px] py-[2px] rounded-[3px]">
              PRO
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-[10px] py-3">
          <div className="text-[9px] font-semibold text-[var(--g4)] uppercase tracking-[0.1em] px-[7px] mb-1">
            Main
          </div>
          <a
            href="#"
            className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-xs font-medium bg-[rgba(59,130,246,0.14)] text-[var(--blue)] mb-[1px]"
          >
            <span className="text-sm opacity-80">⊞</span>
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-xs font-medium text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g1)] transition-all mb-[1px]"
          >
            <span className="text-sm opacity-80">📄</span>
            Resume Builder
          </a>
          <a
            href="#"
            className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-xs font-medium text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g1)] transition-all mb-[1px]"
          >
            <span className="text-sm opacity-80">🎯</span>
            AI Tailor
            <span className="ml-auto bg-[var(--blue)] text-white text-[9px] font-bold px-[5px] py-[1px] rounded-[9px]">
              3
            </span>
          </a>
        </div>

        <div className="px-[10px] py-3">
          <div className="text-[9px] font-semibold text-[var(--g4)] uppercase tracking-[0.1em] px-[7px] mb-1">
            Documents
          </div>
          <a
            href="#"
            className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-xs font-medium text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g1)] transition-all mb-[1px]"
          >
            <span className="text-sm opacity-80">✉️</span>
            Cover Letters
          </a>
          <a
            href="#"
            className="flex items-center gap-[9px] px-[10px] py-2 rounded-[7px] text-xs font-medium text-[var(--g3)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--g1)] transition-all mb-[1px]"
          >
            <span className="text-sm opacity-80">🎓</span>
            Scholarship Suite
          </a>
        </div>

        {/* User Card at Bottom */}
        <div className="mt-auto px-[10px] py-3 border-t border-[var(--border)]">
          <div className="px-[10px] py-[9px] mb-2">
            <div className="flex justify-between text-[10px] mb-[5px]">
              <span className="text-[var(--g3)]">Credits remaining</span>
              <span className="text-white font-semibold">142 / 200</span>
            </div>
            <div className="h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
              <div className="h-full w-[71%] bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-[9px] px-[10px] py-[9px] rounded-[7px] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--g1)] truncate">
                {session.user?.name || "User"}
              </div>
              <div className="text-[9px] text-[var(--blue)] font-semibold">
                Pro Plan
              </div>
            </div>
            <span className="text-[var(--g4)] text-[10px]">▾</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[224px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="h-14 px-6 flex items-center justify-between bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-[5px] text-xs text-[var(--g4)]">
              <span>CareerForge</span>
              <span className="text-[var(--g5)]">›</span>
              <span className="text-white font-semibold">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <button className="w-8 h-8 rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] flex items-center justify-center text-[13px] text-[var(--g3)] relative">
              🔔
              <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-[var(--orange)] border-2 border-[var(--surface)]"></div>
            </button>
            <button className="w-8 h-8 rounded-[7px] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] flex items-center justify-center text-[13px] text-[var(--g3)]">
              ❓
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-[5px] px-[14px] py-[6px] rounded-[7px] bg-gradient-to-br from-[var(--blue)] to-[#2563eb] text-white border-none cursor-pointer font-[var(--font-d)] font-bold text-xs shadow-[0_0_14px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(34,211,238,0.06)] border border-[rgba(59,130,246,0.2)] rounded-[13px] px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-[var(--font-d)] text-xl font-extrabold text-white tracking-[-0.03em]">
                Welcome back, {session.user?.name || "User"} 👋
              </h2>
              <p className="text-xs text-[var(--g3)] mt-1">
                Your ATS score improved <strong className="text-[var(--green)]">+18 points</strong> this week. You're on track!
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-[14px] py-[6px] rounded-[7px] text-xs font-semibold bg-[var(--blue)] text-white shadow-[0_0_12px_rgba(59,130,246,0.35)] hover:translate-y-[-1px] transition-all">
                + New Resume
              </button>
              <button className="px-[14px] py-[6px] rounded-[7px] text-xs font-semibold bg-[rgba(255,255,255,0.06)] text-[var(--g2)] border border-[var(--border2)] hover:bg-[rgba(255,255,255,0.1)] transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📊", label: "ATS Score", value: "87", change: "+18 pts", color: "blue" },
              { icon: "📄", label: "Resumes Created", value: "4", change: "+2 this week", color: "green" },
              { icon: "📨", label: "Applications Sent", value: "23", change: "+6 this week", color: "purple" },
              { icon: "⚡", label: "Credits Left", value: "142", change: "58 used", color: "orange" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#131720] border border-[var(--border)] rounded-[14px] p-5 relative overflow-hidden transition-all duration-[400ms] hover:border-[var(--border2)] hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] cursor-pointer group"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-400 pointer-events-none group-hover:opacity-100"></div>
                
                <div className="flex justify-between items-start mb-[10px] relative z-10">
                  <div className={`w-[34px] h-[34px] rounded-[8px] flex items-center justify-center text-base bg-[rgba(59,130,246,0.15)]`}>
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[rgba(16,185,129,0.12)] text-[var(--green)]">
                    {stat.change}
                  </span>
                </div>
                
                <div className="font-[var(--font-d)] text-[28px] font-extrabold leading-none text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-[var(--g3)] mt-[3px] uppercase tracking-[0.07em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Info */}
          <div className="bg-[var(--panel)] border border-[var(--border)] rounded-[16px] p-6">
            <h3 className="font-[var(--font-d)] text-base font-bold text-white mb-4">
              🎉 Your account is active
            </h3>
            <p className="text-sm text-[var(--g3)] leading-relaxed mb-4">
              You're logged in as <strong className="text-white">{session.user?.email}</strong>
            </p>
            <p className="text-xs text-[var(--g4)] leading-relaxed">
              This is a protected dashboard page. Only authenticated users can access this content.
              The middleware automatically redirects unauthenticated users to the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
