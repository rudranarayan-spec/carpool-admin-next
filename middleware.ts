import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get the auth token/session cookie
  const authToken = request.cookies.get("admin_session")?.value;

  // 2. Define public routes that don't require authentication
  const isPublicRoute = pathname.startsWith("/login");

  // 3. If the user is NOT authenticated and trying to access a protected page -> Redirect to /login
  if (!authToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    // (Optional) Save the page they were trying to visit so you can redirect them back after login
    loginUrl.searchParams.set("from", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 4. If the user IS authenticated and tries to visit /login -> Redirect to dashboard
  if (authToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Config matcher: Specify which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, icons, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};