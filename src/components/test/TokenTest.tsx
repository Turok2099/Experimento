"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const TokenTest: React.FC = () => {
  const { userData } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testToken = async () => {
    setTestResults([]);
    addResult("🔍 Iniciando prueba de token...");

    if (!userData?.token) {
      addResult("❌ No hay token disponible");
      return;
    }

    addResult(`📋 Token encontrado: ${userData.token.substring(0, 20)}...`);
    addResult(`👤 Usuario: ${userData.user?.email || "No disponible"}`);
    addResult(`🎭 Rol: ${userData.user?.role || "No disponible"}`);

    const API_BASE = "https://nestjs-render-app.onrender.com";

    // Probar endpoint público
    try {
      addResult("📡 Probando /classes (público)...");
      const classesRes = await fetch(`${API_BASE}/classes`);
      addResult(`✅ /classes: ${classesRes.status} ${classesRes.statusText}`);
    } catch (error) {
      addResult(`❌ Error en /classes: ${error}`);
    }

    // Probar endpoint de agenda
    try {
      addResult("📡 Probando /reservations/me (autenticado)...");
      const agendaRes = await fetch(`${API_BASE}/reservations/me`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      addResult(
        `📊 /reservations/me: ${agendaRes.status} ${agendaRes.statusText}`
      );

      if (agendaRes.ok) {
        const data = await agendaRes.json();
        addResult(`✅ Agenda obtenida: ${data.length} elementos`);
      } else {
        const errorData = await agendaRes.text();
        addResult(`❌ Error en agenda: ${errorData}`);
      }
    } catch (error) {
      addResult(`❌ Error en /reservations/me: ${error}`);
    }

    // Probar endpoint de usuario
    try {
      addResult("📡 Probando /auth/me...");
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      addResult(`📊 /auth/me: ${meRes.status} ${meRes.statusText}`);

      if (meRes.ok) {
        const data = await meRes.json();
        addResult(`✅ Usuario autenticado: ${data.email}`);
      } else {
        const errorData = await meRes.text();
        addResult(`❌ Error en /auth/me: ${errorData}`);
      }
    } catch (error) {
      addResult(`❌ Error en /auth/me: ${error}`);
    }
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#f0f0f0", margin: "20px" }}
    >
      <h3>🔧 Token Test Component</h3>
      <button
        onClick={testToken}
        style={{ padding: "10px", marginBottom: "20px" }}
      >
        Probar Token
      </button>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h4>Resultados:</h4>
        {testResults.map((result, index) => (
          <div
            key={index}
            style={{ marginBottom: "5px", fontFamily: "monospace" }}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenTest;


