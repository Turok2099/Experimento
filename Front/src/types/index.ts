// src/types/index.ts

export interface ILoginProps {
  email: string;
  password: string;
}

export interface ILoginErrors {
  email?: string;
  password?: string;
}

export interface IRegisterProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
}

export interface IRegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  phone?: string;
}

// omite el confirm se envie al backend
export type IRegisterPayload = Omit<IRegisterProps, "confirmPassword">;

// Sesión / Autenticación
export interface IUserSession {
  // algunos flujos guardan 'token', otros 'accessToken'
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;

  user?: {
    // si tu backend usa UUID, deja string | number para ser flexible
    id?: string | number;
    name?: string | null;
    email?: string | null;
    address?: string | null;
    phone?: string | null;
    role?: string | "member" | "trainer" | "admin" | null;
  };
}

// Dashboard / Front
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export interface Comentary {
  id: string | number;
  userId: string;
  text: string;
  rating: number;
  date: string;
  user: {
    id: string | number;
    name: string;
  };
  status?: 'pending' | 'approved' | 'rejected'; 
}

export interface Class {
  id: number;
  nombre: string;
  fechaCreacion: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  tutor: string;
  capacidad: number;
}

export interface HistorialClase {
  id: number;
  userId: number;
  clase: string;
  fecha: string;
}

// Admin
export interface Useradmin {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  address: string | null;
  phone: string | null;
  type: "user" | "admin" | "trainer";
  plan: "mensual" | "anual" | "ninguno";
  dateregis: string;
  status: "Activo" | "Inactivo";
  isBlocked: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}
