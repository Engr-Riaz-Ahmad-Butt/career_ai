import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Access tokens are memory-only (Zustand) and refresh tokens are HttpOnly cookies
  // scoped to the API domain; edge middleware cannot reliably validate auth here.
  return NextResponse.next();
}

