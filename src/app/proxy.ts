import { PageRoutes } from "@/constants/page-routes";
import { getSession } from "@/server/better-auth/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that always require authentication
const AUTH_REQUIRED_ROUTES = [
  PageRoutes.DASHBOARD,
  PageRoutes.SETTINGS,
  PageRoutes.UPLOAD,
  PageRoutes.FLASHCARDS_UPLOAD,
];

// Routes that allow anonymous access to public content
const PUBLIC_CONTENT_ROUTES = ["/study/", "/flashcards/", "/profile/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for auth pages and API routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check if route always requires auth
  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Check if route allows public content
  const allowsPublic = PUBLIC_CONTENT_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // For routes that always require auth, check session
  if (requiresAuth) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL(PageRoutes.LOGIN, request.url));
    }
  }

  // For routes that allow public content, let the page handle auth
  // The page will use public procedures that check visibility
  if (allowsPublic) {
    return NextResponse.next();
  }

  // Default: require authentication for other app routes
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL(PageRoutes.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
