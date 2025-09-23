'use client';

import { AuthProvider } from "@/context/AuthContext";
import { ClasesProvider } from "@/context/ClasesContext"; 
import TablaClases from "@/views/table/TablaClases";

export default function ClasesPage() {
  return (
    <AuthProvider>
      <ClasesProvider>
        <TablaClases />
      </ClasesProvider>
    </AuthProvider>
  );
}
