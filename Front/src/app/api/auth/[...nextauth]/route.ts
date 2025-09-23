import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Verificar variables de entorno
console.log("🔧 Variables de entorno:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Presente" : "❌ Ausente",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
    ? "✅ Presente"
    : "❌ Ausente",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Presente" : "❌ Ausente",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "❌ Ausente",
});

// Verificar si el archivo .env.local se está cargando
console.log("📁 Archivo .env.local:", {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Cargado" : "No cargado",
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("🔑 JWT Callback ejecutado", {
        hasAccount: !!account,
        hasProfile: !!profile,
        provider: account?.provider,
        hasBackendJWT: !!token.backendJWT,
        hasUserData: !!token.userData,
      });

      // Cuando el usuario se logea por primera vez
      if (account && profile) {
        console.log("👤 Datos de Google recibidos:", {
          name: profile.name,
          email: profile.email,
          provider: account.provider,
        });

        token.user = {
          name: profile.name,
          email: profile.email,
          picture: (profile as any).picture,
        };

        // Aquí puedes avisarle a tu backend
        // Enviando el token de Google para que genere un JWT propio
        try {
          console.log("🔄 Sincronizando con backend...");
          console.log(
            "🌐 URL del backend:",
            "http://localhost:3001/auth/google"
          );
          console.log(
            "🔑 ID Token:",
            account.id_token ? "Presente" : "Ausente"
          );

          const response = await fetch("http://localhost:3001/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: account.id_token, // viene de Google
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Usuario sincronizado:", data.user.email);
            console.log("📊 Datos del usuario:", {
              name: data.user.name,
              email: data.user.email,
              address: data.user.address,
              phone: data.user.phone,
            });
            token.backendJWT = data.accessToken;
            token.userData = data.user; // Guardar datos del usuario del backend
            // Verificar si necesita completar datos (más estricto)
            const hasAddress =
              data.user.address && data.user.address.trim() !== "";
            const hasPhone = data.user.phone && data.user.phone.trim() !== "";
            token.needsCompletion = !hasAddress || !hasPhone;
            console.log("📝 Necesita completar datos:", token.needsCompletion);
            console.log("🔍 Evaluación needsCompletion:", {
              hasAddress: hasAddress,
              hasPhone: hasPhone,
              addressValue: data.user.address,
              phoneValue: data.user.phone,
              needsCompletion: token.needsCompletion,
            });
          } else {
            const errorData = await response.json();
            console.error("❌ Error del backend:", errorData);
            throw new Error(
              `Backend error: ${errorData.message || "Unknown error"}`
            );
          }
        } catch (err) {
          console.error("❌ Error sync backend:", err);
          // No lanzar error para no interrumpir el login de Google
          // El usuario podrá intentar de nuevo
        }
      } else if (token.user && !token.backendJWT) {
        // Si hay usuario pero no hay datos del backend, intentar sincronizar
        console.log(
          "🔄 Usuario existente sin datos del backend, intentando sincronizar..."
        );

        try {
          const response = await fetch(
            "http://localhost:3001/auth/google/sync",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: (token.user as any)?.email,
                name: (token.user as any)?.name,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(
              "✅ Usuario sincronizado (sesión existente):",
              data.user.email
            );
            token.backendJWT = data.accessToken;
            token.userData = data.user;
            const hasAddress =
              data.user.address && data.user.address.trim() !== "";
            const hasPhone = data.user.phone && data.user.phone.trim() !== "";
            token.needsCompletion = !hasAddress || !hasPhone;
            console.log("📝 Necesita completar datos:", token.needsCompletion);
          }
        } catch (err) {
          console.error("❌ Error sync backend (sesión existente):", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("📋 Session Callback ejecutado", {
        hasToken: !!token,
        hasUser: !!token.user,
        hasBackendJWT: !!token.backendJWT,
        hasUserData: !!token.userData,
        needsCompletion: token.needsCompletion,
      });

      session.user = token.user as any;
      session.backendJWT = token.backendJWT as string; //Tu JWT real del backend
      session.userData = token.userData as any; // Datos del usuario del backend
      session.needsCompletion = token.needsCompletion as boolean; // Si necesita completar datos

      console.log("📋 Sesión final:", {
        user: session.user?.email,
        needsCompletion: session.needsCompletion,
        hasBackendJWT: !!session.backendJWT,
      });

      return session;
    },
  },
});

export { handler as GET, handler as POST };
