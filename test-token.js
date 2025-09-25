// Script de prueba para verificar el token y hacer peticiones
const API_BASE = "https://nestjs-render-app.onrender.com";

async function testToken() {
  console.log("🔍 Iniciando prueba de token...");

  // Obtener token del localStorage (simulando lo que hace el frontend)
  const stored = localStorage.getItem("userSession");
  if (!stored) {
    console.error("❌ No hay sesión almacenada en localStorage");
    return;
  }

  const userData = JSON.parse(stored);
  const token = userData.token;

  console.log("📋 Datos de sesión:", {
    token: token ? `${token.substring(0, 20)}...` : "Ausente",
    user: userData.user?.email || "No disponible",
    role: userData.user?.role || "No disponible",
  });

  if (!token) {
    console.error("❌ No hay token en la sesión");
    return;
  }

  // Probar endpoint de clases (público)
  try {
    console.log("📡 Probando endpoint /classes...");
    const classesRes = await fetch(`${API_BASE}/classes`);
    console.log("✅ /classes:", classesRes.status, classesRes.statusText);

    if (classesRes.ok) {
      const classesData = await classesRes.json();
      console.log("📊 Clases obtenidas:", classesData.length);
    }
  } catch (error) {
    console.error("❌ Error en /classes:", error);
  }

  // Probar endpoint de agenda (requiere autenticación)
  try {
    console.log("📡 Probando endpoint /reservations/me...");
    const agendaRes = await fetch(`${API_BASE}/reservations/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 /reservations/me:", agendaRes.status, agendaRes.statusText);

    if (agendaRes.ok) {
      const agendaData = await agendaRes.json();
      console.log("✅ Agenda obtenida:", agendaData.length);
    } else {
      const errorData = await agendaRes.text();
      console.error("❌ Error en agenda:", errorData);
    }
  } catch (error) {
    console.error("❌ Error en /reservations/me:", error);
  }

  // Probar endpoint de autenticación
  try {
    console.log("📡 Probando endpoint /auth/me...");
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 /auth/me:", meRes.status, meRes.statusText);

    if (meRes.ok) {
      const meData = await meRes.json();
      console.log("✅ Usuario autenticado:", meData.email);
    } else {
      const errorData = await meRes.text();
      console.error("❌ Error en /auth/me:", errorData);
    }
  } catch (error) {
    console.error("❌ Error en /auth/me:", error);
  }
}

// Ejecutar la prueba
testToken();


