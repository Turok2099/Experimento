"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { trainingGoals } from "@/helpers/fitnessLists";
import { getMuscleGroupImage } from "@/helpers/muscleGroupImages";
import { getClassImage } from "@/helpers/classImages";
import styles from "./routineView.module.scss";
import DailyRoutine from "@/components/routine/dailyRoutine";
import {
  exerciseService,
  ExerciseForRoutine,
} from "@/services/ExerciseService";
import { ClasesService } from "@/services/ClasesService";

export type RoutineItem = {
  nombre: string;
  series?: number;
  repeticiones?: string;
  grupoMuscular: string;
  imagen: string;
  goal: string;
};

type Category = {
  grupo: string;
  imagen: string;
};

export default function RoutineView() {
  const [step, setStep] = useState(1);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<RoutineItem[]>([]);
  const [routineRegistered, setRoutineRegistered] = useState(false);

  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  // Estados para datos reales
  const [exercises, setExercises] = useState<ExerciseForRoutine[]>([]);
  // const [categories, setCategories] = useState<ExerciseCategory[]>([]); // No se usa directamente
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isStrength = activeGoal === "Fuerza máxima";
  const isHypertrophy = activeGoal === "Hipertrofia";
  const isResistance = activeGoal === "Resistencia";
  const isClasses = activeGoal === "Clases";

  // Cargar datos reales al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 [RoutineView] Cargando datos reales...");

        // Cargar ejercicios y clases en paralelo
        const [exercisesData, classesData] = await Promise.all([
          exerciseService.getExercises(),
          ClasesService.getAllClasses(), // Obtener clases reales
        ]);

        console.log("✅ [RoutineView] Datos cargados:", {
          exercises: exercisesData.length,
          classes: classesData.length,
        });

        // Debug específico para ejercicios de resistencia
        const resistanceExercises = exercisesData.filter(
          (ex) => ex.categoria === "Resistencia"
        );
        console.log(
          "🏋️ [RoutineView] Ejercicios de resistencia:",
          resistanceExercises.length
        );
        resistanceExercises.forEach((ex, index) => {
          console.log(`${index + 1}. ${ex.ejercicio} - Tiempo: ${ex.tiempo}`);
        });

        setExercises(exercisesData);
        setClasses(classesData);
      } catch (err: any) {
        console.error("❌ [RoutineView] Error cargando datos:", err);
        setError(err.message || "Error al cargar los datos");

        // En caso de error, usar datos mock como fallback
        console.log("🔄 [RoutineView] Usando datos mock como fallback...");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleGoal = (goal: string) => {
    setExpandedGoal((prev) => (prev === goal ? null : goal));
  };

  const strengthData: RoutineItem[] = useMemo(() => {
    if (!(isStrength || isHypertrophy) || !activeGoal || loading) return [];

    return exercises.map((exercise) => {
      const config = isStrength ? exercise.fuerza : exercise.hipertrofia;

      return {
        nombre: exercise.ejercicio,
        grupoMuscular: exercise.grupo,
        series: config.series,
        repeticiones: String(config.repeticiones),
        imagen: exercise.imagenEjercicio,
        goal: activeGoal,
      };
    });
  }, [activeGoal, isStrength, isHypertrophy, exercises, loading]);

  // 2️⃣ Categorías (paso 2) - Grupos musculares
  const availableCategories: Category[] = useMemo(() => {
    if (!activeGoal || loading) return [];

    // Para Clases: mostrar todas las clases disponibles
    if (isClasses) {
      const classMap = new Map<string, string>();
      classes.forEach((clase) => {
        if (!classMap.has(clase.title)) {
          // Usar la imagen específica de la clase desde nuestro helper
          classMap.set(clase.title, getClassImage(clase.title));
        }
      });
      return Array.from(classMap.entries()).map(([grupo, imagen]) => ({
        grupo,
        imagen,
      }));
    }

    // Para Resistencia: mostrar solo ejercicios de máquina (categoría "Resistencia")
    if (isResistance) {
      console.log("🔍 [RoutineView] Procesando resistencia...");
      console.log("📊 Total ejercicios disponibles:", exercises.length);

      const resistanceExercises = exercises.filter(
        (ex) => ex.categoria === "resistencia"
      );
      console.log(
        "🏋️ Ejercicios de resistencia encontrados:",
        resistanceExercises.length
      );

      const resistanceMap = new Map<string, string>();
      exercises.forEach((exercise) => {
        if (exercise.categoria === "resistencia" && exercise.tiempo) {
          console.log(
            `✅ Agregando: ${exercise.ejercicio} - Tiempo: ${exercise.tiempo}`
          );
          if (!resistanceMap.has(exercise.ejercicio)) {
            resistanceMap.set(
              exercise.ejercicio,
              exercise.imagenEjercicio || "/Train UP.png"
            );
          }
        }
      });

      const result = Array.from(resistanceMap.entries()).map(
        ([grupo, imagen]) => ({
          grupo,
          imagen,
        })
      );

      console.log("📋 Resultado final para resistencia:", result);
      return result;
    }

    // Para fuerza e hipertrofia, filtrar solo grupos musculares que tienen ejercicios
    const categoriesWithExercises = new Map<string, string>();

    exercises.forEach((exercise) => {
      // Solo incluir si tiene ejercicios para el tipo seleccionado
      const hasExercisesForType = isStrength
        ? exercise.fuerza.series > 0 && exercise.fuerza.repeticiones > 0
        : isHypertrophy
        ? exercise.hipertrofia.series > 0 &&
          exercise.hipertrofia.repeticiones > 0
        : false;

      if (hasExercisesForType && !categoriesWithExercises.has(exercise.grupo)) {
        // Usar la imagen específica del grupo muscular desde nuestro helper
        categoriesWithExercises.set(
          exercise.grupo,
          getMuscleGroupImage(exercise.grupo)
        );
      }
    });

    console.log(
      `🎯 [RoutineView] Grupos musculares disponibles para ${activeGoal}:`,
      Array.from(categoriesWithExercises.keys())
    );

    return Array.from(categoriesWithExercises.entries()).map(
      ([grupo, imagen]) => ({
        grupo,
        imagen,
      })
    );
  }, [
    activeGoal,
    isClasses,
    isResistance,
    classes,
    exercises,
    isStrength,
    isHypertrophy,
    loading,
  ]);

  const availableItems: RoutineItem[] = useMemo(() => {
    if (!activeGoal || !selectedCategory || loading) return [];

    // Para Clases: mostrar la clase específica seleccionada
    if (isClasses) {
      const selectedClass = classes.find(
        (clase) => clase.title === selectedCategory
      );
      if (selectedClass) {
        return [
          {
            nombre: selectedClass.title,
            series: 1,
            repeticiones: `${selectedClass.startTime} - ${selectedClass.endTime}`,
            grupoMuscular: "Clase",
            imagen: selectedClass.imageUrl || "/Train UP.png",
            goal: activeGoal,
          },
        ];
      }
      return [];
    }

    // Para Resistencia: mostrar el ejercicio de máquina específico
    if (isResistance) {
      const selectedExercise = exercises.find(
        (exercise) =>
          exercise.ejercicio === selectedCategory &&
          exercise.categoria === "resistencia"
      );
      if (selectedExercise) {
        return [
          {
            nombre: selectedExercise.ejercicio,
            grupoMuscular: "Resistencia",
            repeticiones: selectedExercise.tiempo || "30 min",
            imagen: selectedExercise.imagenEjercicio || "/Train UP.png",
            goal: activeGoal,
          },
        ];
      }
      return [];
    }

    // Para fuerza e hipertrofia, usar ejercicios reales
    return strengthData.filter(
      (item) => item.grupoMuscular === selectedCategory
    );
  }, [
    activeGoal,
    selectedCategory,
    isClasses,
    isResistance,
    strengthData,
    classes,
    exercises,
    loading,
  ]);

  // ✅ Handlers
  const handleStartExercises = (goal: string) => {
    setActiveGoal(goal);
    setSelectedCategory("");
    setStep(2);
  };

  const handleItemToggle = (item: RoutineItem) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.nombre === item.nombre && i.goal === item.goal)
        ? prev.filter(
            (i) => !(i.nombre === item.nombre && i.goal === item.goal)
          )
        : [...prev, item]
    );
  };

  const handleRegisterRoutine = () => setRoutineRegistered(true);

  const handleNewRoutine = () => {
    setRoutineRegistered(false);
    setStep(1);
    setActiveGoal(null);
    setSelectedCategory("");
    setSelectedItems([]);
    setExpandedGoal(null);
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case "Fuerza máxima":
        return "Programa orientado a desarrollar la fuerza absoluta mediante el levantamiento de cargas muy pesadas con pocas repeticiones por serie. Ideal para quienes buscan aumentar su capacidad de generar potencia máxima, mejorar el rendimiento en deportes de fuerza y optimizar la técnica en movimientos compuestos como sentadillas, press de banca o peso muerto.";
      case "Hipertrofia":
        return "Enfoque diseñado para estimular el crecimiento muscular a través de un volumen de entrenamiento moderado-alto, con repeticiones controladas y tiempos de descanso estratégicos. Perfecto para quienes desean mejorar la estética corporal, aumentar la masa muscular y lograr una musculatura más definida y simétrica.";
      case "Resistencia":
        return "Entrenamiento enfocado en ejercicios cardiovasculares usando máquinas especializadas como bicicletas estáticas, cintas de correr, elípticas y remadoras. Perfecto para mejorar la condición cardiovascular, quemar calorías, aumentar la resistencia aeróbica y mantener un corazón saludable con sesiones de intensidad controlada.";
      case "Clases":
        return "Participa en clases grupales dirigidas por entrenadores profesionales. Disfruta de una variedad de actividades como Boxeo, HIIT, Pilates, Spinning, Zumba y más. Ideal para quienes buscan motivación grupal, variedad en su rutina de ejercicios y la guía experta de instructores certificados en un ambiente dinámico y social.";
      default:
        return "";
    }
  };

  return (
    <div className={styles.mainWrapper}>
      {loading && (
        <div className={styles.container}>
          <div className={styles.loadingMessage}>
            <p>Cargando ejercicios y clases disponibles...</p>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <p>Usando datos de ejemplo como respaldo.</p>
          </div>
        </div>
      )}

      {!routineRegistered && !loading && (
        <div className={styles.container}>
          {/* Paso 1: Selección de meta */}
          {step === 1 && (
            <div className={styles.goalColumn}>
              {trainingGoals.map((goal, idx) => (
                <div
                  key={goal}
                  className={`${styles.goalCard} ${
                    expandedGoal === goal ? styles.activeCard : ""
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <div className={styles.goalInfo}>
                    <Image
                      src={
                        goal === "Clases"
                          ? "/Train UP.png"
                          : `/rutina/${idx + 1}.png`
                      }
                      alt={goal || "Meta de entrenamiento"}
                      width={100}
                      height={100}
                      className={styles.cardImage}
                    />
                    <div className={styles.cardTitle}>{goal || "Sin meta"}</div>
                  </div>

                  {expandedGoal === goal && (
                    <div className={styles.goalDetails}>
                      <p>{getGoalDescription(goal)}</p>
                      <button
                        className={styles.viewExercisesButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartExercises(goal);
                        }}
                      >
                        Ver ejercicios →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Paso 2: Categorías */}
          {step === 2 && (
            <>
              <div className={styles.cardGrid}>
                {availableCategories.map(({ grupo, imagen }) => (
                  <div
                    key={grupo}
                    className={styles.card}
                    onClick={() => {
                      setSelectedCategory(grupo);
                      setStep(3);
                    }}
                  >
                    <Image
                      src={imagen || "/Train UP.png"}
                      alt={grupo || "Categoría de ejercicio"}
                      width={100}
                      height={100}
                      className={styles.categoryImage}
                    />
                    <h3 className={styles.cardTitle}>
                      {grupo || "Sin categoría"}
                    </h3>
                  </div>
                ))}
              </div>
              <button
                className={styles.backButton}
                onClick={() => {
                  setActiveGoal(null);
                  setStep(1);
                }}
              >
                ← Volver
              </button>
            </>
          )}

          {/* Paso 3: Ejercicios */}
          {step === 3 && (
            <div className={styles.stepContainer}>
              <div className={styles.sectionTitleContainer}>
                {isClasses ? (
                  <>
                    <span className={styles.titleLabel}>Clase</span>
                    <h3 className={styles.categoryTitle}>{selectedCategory}</h3>
                  </>
                ) : isResistance ? (
                  <>
                    <span className={styles.titleLabel}>Máquina</span>
                    <h3 className={styles.categoryTitle}>{selectedCategory}</h3>
                  </>
                ) : (
                  <>
                    <span className={styles.titleLabel}>Ejercicios</span>
                    <h3 className={styles.categoryTitle}>{selectedCategory}</h3>
                  </>
                )}
              </div>

              {availableItems.length === 0 ? (
                <p>No hay ejercicios disponibles para esta categoría.</p>
              ) : (
                <ul className={styles.list}>
                  {availableItems.map((item) => (
                    <li
                      key={`${item.goal}-${item.nombre}`}
                      className={styles.listItem}
                    >
                      <div className={styles.itemRow}>
                        <div className={styles.itemImageWrapper}>
                          <Image
                            src={item.imagen || "/Train UP.png"}
                            alt={item.nombre || "Ejercicio"}
                            width={50}
                            height={50}
                            className={styles.itemImage}
                          />
                        </div>
                        <div className={styles.itemText}>
                          <strong>{item.nombre}</strong>
                          {/* Para clases, mostrar solo horario */}
                          {isClasses && item.repeticiones && (
                            <span className={styles.itemDetails}>
                              Horario: {item.repeticiones}
                            </span>
                          )}
                          {/* Para ejercicios, mostrar series y repeticiones */}
                          {!isClasses &&
                            item.series != null &&
                            item.repeticiones != null && (
                              <span className={styles.itemDetails}>
                                Series: {item.series} Repeticiones:{" "}
                                {item.repeticiones}
                              </span>
                            )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (i) =>
                              i.nombre === item.nombre && i.goal === item.goal
                          )}
                          onChange={() => handleItemToggle(item)}
                          className={styles.checkbox}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className={styles.backButton} onClick={() => setStep(2)}>
                ← Volver
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resumen */}
      <DailyRoutine
        selectedItems={selectedItems}
        routineRegistered={routineRegistered}
        onRegister={handleRegisterRoutine}
        onNewRoutine={handleNewRoutine}
      />
    </div>
  );
}
