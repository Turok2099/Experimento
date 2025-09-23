import React, { createContext, useState, useEffect } from "react";

interface Clase {
  dia: string;
  clase: string;
  hora: string;
  usuario: string;
}

interface ClasesContextType {
  clases: Clase[];
  agregarClase: (c: Clase) => void;
  eliminarClase: (dia: string, clase: string) => void;
  loaded: boolean;
}

export const ClasesContext = createContext<ClasesContextType>({
  clases: [],
  agregarClase: () => {},
  eliminarClase: () => {},
  loaded: false
});

export const ClasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("clases");
    if (stored) setClases(JSON.parse(stored));
    setLoaded(true);
  }, []);

  const agregarClase = (c: Clase) => {
    setClases(prev => {
      const updated = [...prev, c];
      localStorage.setItem("clases", JSON.stringify(updated));
      return updated;
    });
  };

  const eliminarClase = (dia: string, clase: string) => {
    setClases(prev => {
      const updated = prev.filter(cl => !(cl.dia === dia && cl.clase === clase));
      localStorage.setItem("clases", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ClasesContext.Provider value={{ clases, agregarClase, eliminarClase, loaded }}>
      {children}
    </ClasesContext.Provider>
  );
};
