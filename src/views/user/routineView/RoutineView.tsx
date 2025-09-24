"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { cardioActivities, trainingGoals } from "@/helpers/fitnessLists";
import styles from "./routineView.module.scss";
import DailyRoutine from "@/components/routine/dailyRoutine";
import {
  exerciseService,
  ExerciseForRoutine,
  ExerciseCategory,
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
  const isCardio = activeGoal === "Resistencia muscular";

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

  // 2️⃣ Categorías (paso 2)
  const availableCategories: Category[] = useMemo(() => {
    if (!activeGoal || loading) return [];
    if (isCardio) {
      // Para cardio, usar clases reales + actividades mock
      const map = new Map<string, string>();

      // Agregar clases reales
      classes.forEach((clase) => {
        if (!map.has(clase.title)) {
          map.set(clase.title, clase.imageUrl || "/Train UP.png");
        }
      });

      // Agregar actividades mock como fallback
      cardioActivities.forEach((a) => {
        if (!map.has(a.grupo)) map.set(a.grupo, a.imagenGrupo);
      });

      return Array.from(map.entries()).map(([grupo, imagen]) => ({
        grupo,
        imagen,
      }));
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
        categoriesWithExercises.set(exercise.grupo, exercise.imagenGrupo);
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
    isCardio,
    classes,
    exercises,
    isStrength,
    isHypertrophy,
    loading,
  ]);

  const availableItems: RoutineItem[] = useMemo(() => {
    if (!activeGoal || !selectedCategory || loading) return [];

    if (isCardio) {
      // Para cardio, buscar en clases reales primero
      const realClass = classes.find(
        (clase) => clase.title === selectedCategory
      );
      if (realClass) {
        return [
          {
            nombre: realClass.title,
            series: 1,
            repeticiones: `${realClass.startTime} - ${realClass.endTime}`,
            grupoMuscular: "Clase",
            imagen: realClass.imageUrl || "/Train UP.png",
            goal: activeGoal,
          },
        ];
      }

      // Fallback a actividades mock
      return cardioActivities
        .filter((a) => a.grupo === selectedCategory)
        .map((a) => ({
          nombre: a.ejercicio,
          series: a.resistencia.series,
          repeticiones: a.resistencia.repeticiones,
          grupoMuscular: a.grupo,
          imagen: a.imagenEjercicio,
          goal: activeGoal,
        }));
    }

    // Para fuerza e hipertrofia, usar ejercicios reales
    return strengthData.filter(
      (item) => item.grupoMuscular === selectedCategory
    );
  }, [activeGoal, selectedCategory, isCardio, strengthData, classes, loading]);

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
      case "Resistencia muscular":
        return "Plan centrado en mejorar la capacidad de los músculos para sostener esfuerzos prolongados, combinando ejercicios cardiovasculares y de fuerza con cargas ligeras y repeticiones altas. Recomendado para quienes buscan optimizar la resistencia física, la salud cardiovascular y el rendimiento en actividades de larga duración.";
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
                      src={`/rutina/${idx + 1}.png`}
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
            <>
              <h3 className={styles.sectionTitle}>
                {isCardio
                  ? `Actividades "${selectedCategory}":`
                  : `Ejercicios ${selectedCategory}:`}
              </h3>

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
                          {item.series != null && item.repeticiones != null && (
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
            </>
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
