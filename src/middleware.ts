import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server"; // FIX: Import from next/server

export async function middleware(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not use supabase.auth.getSession().
  // Use getUser() for security as it re-validates the user with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protected Routes: Redirect to login if not authenticated
  const protectedPaths = [
    "/dashboard",
    "/transactions",
    "/accounts",
    "/settings",
    "/categories",
    "/profile",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Public Routes: Redirect to dashboard if already logged in
  // This prevents logged-in users from seeing the Landing Page, Login, or Signup
  const authPaths = ["/login", "/signup"];
  const isAuthPath = authPaths.includes(pathname);
  const isRoot = pathname === "/";

  if (user && (isAuthPath || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
