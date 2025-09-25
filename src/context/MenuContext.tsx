"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  navbarMenuOpen: boolean;
  coachMenuOpen: boolean;
  openNavbarMenu: () => void;
  openCoachMenu: () => void;
  closeAllMenus: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [navbarMenuOpen, setNavbarMenuOpen] = useState(false);
  const [coachMenuOpen, setCoachMenuOpen] = useState(false);

  const openNavbarMenu = () => {
    setCoachMenuOpen(false); // Cerrar menú del coach
    setNavbarMenuOpen(true); // Abrir menú del navbar
  };

  const openCoachMenu = () => {
    setNavbarMenuOpen(false); // Cerrar menú del navbar
    setCoachMenuOpen(true); // Abrir menú del coach
  };

  const closeAllMenus = () => {
    setNavbarMenuOpen(false);
    setCoachMenuOpen(false);
  };

  return (
    <MenuContext.Provider
      value={{
        navbarMenuOpen,
        coachMenuOpen,
        openNavbarMenu,
        openCoachMenu,
        closeAllMenus,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
