// Definición de la interfaz
export interface Class {
  clase: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  tutor: string;
  capacidad: number;
}

// Datos mock intercalados con los ejercicios solicitados
export const classMock: Class[] = [
  {
    
    clase: "Cardio",
    horaInicio: "08:00",
    horaFin: "09:00",
    diaSemana: "Lunes",
    tutor: "",
    capacidad: 20,
  },
  {
    
    clase: "Spinning",
    horaInicio: "09:00",
    horaFin: "10:00",
    diaSemana: "Martes",
    tutor: "Carlos Méndez",
    capacidad: 15,
  },
  {
    
    clase: "Zumba",
    horaInicio: "10:00",
    horaFin: "11:00",
    diaSemana: "Miércoles",
    tutor: "",
    capacidad: 18,
  },
  {
    
    clase: "Pilates",
    horaInicio: "11:00",
    horaFin: "12:00",
    diaSemana: "Jueves",
    tutor: "Ana López",
    capacidad: 20,
  },
  {
    
    clase: "Boxeo",
    horaInicio: "12:00",
    horaFin: "13:00",
    diaSemana: "Viernes",
    tutor: "",
    capacidad: 25,
  },
  {
    
    clase: "HIIT",
    horaInicio: "13:00",
    horaFin: "14:00",
    diaSemana: "Sábado",
    tutor: "Marcos Díaz",
    capacidad: 16,
  },
  {
    
    clase: "Funcional",
    horaInicio: "14:00",
    horaFin: "15:00",
    diaSemana: "Domingo",
    tutor: "",
    capacidad: 20,
  },
  {
    
    clase: "FullBody",
    horaInicio: "15:00",
    horaFin: "16:00",
    diaSemana: "Lunes",
    tutor: "Lucía Fernández",
    capacidad: 18,
  },
  {
    
    clase: "Stretching",
    horaInicio: "16:00",
    horaFin: "17:00",
    diaSemana: "Martes",
    tutor: "",
    capacidad: 22,
  },
  {
    
    clase: "Powerlifting",
    horaInicio: "17:00",
    horaFin: "18:00",
    diaSemana: "Miércoles",
    tutor: "Elena Torres",
    capacidad: 12,
  },
];
