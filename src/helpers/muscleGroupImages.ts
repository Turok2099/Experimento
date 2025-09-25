// Mapeo de grupos musculares a sus imágenes correspondientes
export const muscleGroupImages: Record<string, string> = {
  "PECHO": "/rutina/filtro2/Grupo Muscular/pecho.png",
  "BRAZO": "/rutina/filtro2/Grupo Muscular/brazo.png", 
  "ESPALDA": "/rutina/filtro2/Grupo Muscular/espalda.png",
  "PIERNA": "/rutina/filtro2/Grupo Muscular/pierna.png",
  "TRICEP": "/rutina/filtro2/Grupo Muscular/tricep.png",
  "LUMBARES": "/rutina/filtro2/Lumbares.png", // Esta imagen está en la raíz de filtro2
  "CLASE": "/Train UP.png", // Para clases grupales
  "MÁQUINA": "/Train UP.png", // Para máquinas de resistencia
};

// Función para obtener la imagen de un grupo muscular
export const getMuscleGroupImage = (muscleGroup: string): string => {
  // Normalizar el nombre del grupo muscular (mayúsculas, sin espacios extra)
  const normalizedGroup = muscleGroup.toUpperCase().trim();
  
  // Buscar la imagen correspondiente
  const image = muscleGroupImages[normalizedGroup];
  
  // Si no se encuentra, devolver imagen por defecto
  return image || "/Train UP.png";
};

// Lista de todos los grupos musculares disponibles
export const availableMuscleGroups = Object.keys(muscleGroupImages);
