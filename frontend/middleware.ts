import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume-builder/:path*",
    "/tailor/:path*",
    "/jobs/:path*",
    "/settings/:path*",
    "/interview-prep/:path*",
    "/documents/:path*",
    "/skill-gap/:path*",
    "/career-growth/:path*",
    "/visa-scholarship/:path*",
    "/ab-testing/:path*",
    "/analyze/:path*",
  ],
};
