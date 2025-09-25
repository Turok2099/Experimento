// Mapeo de clases a sus imágenes correspondientes
export const classImages: Record<string, string> = {
  BOXEO: "/rutina/classes/Boxeo.png",
  FULLBODY: "/rutina/classes/FullBody.png",
  FUNCIONAL: "/rutina/classes/Funcional.png",
  HIIT: "/rutina/classes/HIIT.png",
  PILATES: "/rutina/classes/Pilates.png",
  POWERLIFTING: "/rutina/classes/Powerlifting.png",
  SPINNING: "/rutina/classes/Spinning.png",
  ZUMBA: "/rutina/classes/Zumba.png",
};

// Función para obtener la imagen de una clase
export const getClassImage = (className: string): string => {
  // Normalizar el nombre de la clase (mayúsculas, sin espacios extra)
  const normalizedClass = className.toUpperCase().trim().replace(/\s+/g, "");

  // Buscar coincidencias exactas primero
  if (classImages[normalizedClass]) {
    return classImages[normalizedClass];
  }

  // Buscar coincidencias parciales para nombres similares
  const matchingKey = Object.keys(classImages).find(
    (key) => normalizedClass.includes(key) || key.includes(normalizedClass)
  );

  // Si encontramos una coincidencia, usar esa imagen
  if (matchingKey) {
    return classImages[matchingKey];
  }

  // Si no se encuentra, devolver imagen por defecto
  return "/Train UP.png";
};

// Lista de todas las clases disponibles
export const availableClasses = Object.keys(classImages);

// Función para obtener todas las imágenes de clases
export const getAllClassImages = () => classImages;
