'use client';

import { ClasesProvider } from "@/context/ClasesContext"; 
import TablaClases from "@/views/table/TablaClases";

export default function ClasesPage() {
  return (
    <ClasesProvider>
      <TablaClases />
    </ClasesProvider>
  );
}
