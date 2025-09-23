'use client';

import React from "react";
import TablaClases from "@/views/table/TablaClases";
import { ClasesProvider } from "@/context/ClasesContext"; // asegúrate de la ruta correcta

export default function ClasesPage() {
  return (
    <ClasesProvider>
      <TablaClases />
    </ClasesProvider>
  );
}
