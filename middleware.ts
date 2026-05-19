import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Inlined to keep crypto (Node-only) out of the Edge Runtime bundle
const ADMIN_COOKIE_NAME = "admin_sess";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/onboarding(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/dashboard/admin(.*)",
  "/api/admin(.*)",
]);

const isAdminUnlockRoute = createRouteMatcher([
  "/dashboard/admin/unlock",
  "/api/admin/unlock",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // 1. Clerk auth gates all protected routes
  if (isProtectedRoute(req)) await auth.protect();

  // 2. Admin routes additionally require the PIN session cookie
  if (isAdminRoute(req) && !isAdminUnlockRoute(req)) {
    const adminSession = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminSession) {
      // API routes: return 401 JSON instead of redirect
      if (req.nextUrl.pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Admin session required. Visit /dashboard/admin/unlock first." },
          { status: 401 }
        );
      }
      // Page routes: redirect to unlock page, remembering where they were going
      const unlock = new URL("/dashboard/admin/unlock", req.url);
      unlock.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(unlock);
    }
    // Note: HMAC signature is verified in each page/API handler (needs userId from Clerk).
    // Middleware only checks existence so unauthenticated requests can't reach admin handlers.
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
