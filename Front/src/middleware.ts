// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { IUserSession } from "@/types"; // 👈 asegúrate de que aquí tienes definido el role

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //Rutas accesibles por rol
  const roleRoutes: Record<string, string[]> = {
    admin: ["/routine", "/superadmin"],
    member: ["/userDashboard", "/routine"],
  };

  //Obtener cookie de sesión
  const sessionCookie = request.cookies.get("userSession")?.value;
  let user: IUserSession | null = null;

  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie) as IUserSession;
    } catch (err) {
      console.error("Error al parsear userSession:", err);
    }
  }

  //Usuario NO logueado → bloquear rutas privadas
  if (
    [
      "/userDashboard",
      "/routine",
      "/admindashboard",
      "/superadmin",
      "/subscription",
    ].includes(pathname) &&
    !user
  ) {
    // Redirigir a /register con parámetro si es /subscription, sino a /login
    if (pathname === "/subscription") {
      const redirectUrl = new URL("/register", request.url);
      redirectUrl.searchParams.set("from", "subscription");
      return NextResponse.redirect(redirectUrl);
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  //Usuario logueado → bloquear register y login
  if ((pathname === "/register" || pathname === "/login") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //Usuario logueado pero intentando acceder a ruta NO permitida por rol
  if (user) {
    const role = user.user?.role; // ✅ ya está tipado
    const allowedRoutes = role ? roleRoutes[role] ?? [] : [];

    // Rutas permitidas para todos los usuarios logueados
    const commonRoutes = ["/", "/subscription"];

    if (!allowedRoutes.includes(pathname) && !commonRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

//Indicar qué rutas pasan por este middleware
export const config = {
  matcher: [
    "/userDashboard",
    "/routine",
    "/admindashboard",
    "/superadmin",
    "/subscription",
    "/register",
    "/login",
  ],
};
