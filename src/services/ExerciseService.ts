// Front/src/services/ExerciseService.ts

export interface ExerciseForRoutine {
  id: string;
  grupo: string;
  ejercicio: string;
  categoria: string;
  imagenGrupo: string;
  imagenEjercicio: string;
  fuerza: {
    series: number;
    repeticiones: number;
  };
  hipertrofia: {
    series: number;
    repeticiones: number;
  };
  resistencia: {
    series: number;
    repeticiones: string;
  };
}

export interface ExerciseCategory {
  grupo: string;
  imagen: string;
}

export interface ExercisesResponse {
  ok: boolean;
  total: number;
  page: number;
  limit: number;
  data: ExerciseForRoutine[];
}

export interface CategoriesResponse {
  ok: boolean;
  data: ExerciseCategory[];
}

export interface SingleExerciseResponse {
  ok: boolean;
  data: ExerciseForRoutine;
}

class ExerciseService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  /**
   * Obtener todos los ejercicios públicos (solo activos)
   */
  async getExercises(params?: {
    q?: string;
    muscleGroup?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ExerciseForRoutine[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.q) searchParams.append('q', params.q);
      if (params?.muscleGroup) searchParams.append('muscleGroup', params.muscleGroup);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const url = `${this.baseUrl}/exercises${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      console.log('🔍 [ExerciseService] Obteniendo ejercicios desde:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: ExercisesResponse = await response.json();
      
      console.log(`✅ [ExerciseService] Obtenidos ${result.data.length} ejercicios`);
      
      return result.data;
    } catch (error) {
      console.error('❌ [ExerciseService] Error obteniendo ejercicios:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías/grupos musculares disponibles
   */
  async getCategories(): Promise<ExerciseCategory[]> {
    try {
      const url = `${this.baseUrl}/exercises/categories`;
      
      console.log('🔍 [ExerciseService] Obteniendo categorías desde:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: CategoriesResponse = await response.json();
      
      console.log(`✅ [ExerciseService] Obtenidas ${result.data.length} categorías`);
      
      return result.data;
    } catch (error) {
      console.error('❌ [ExerciseService] Error obteniendo categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener un ejercicio específico por ID
   */
  async getExerciseById(id: string): Promise<ExerciseForRoutine> {
    try {
      const url = `${this.baseUrl}/exercises/${id}`;
      
      console.log('🔍 [ExerciseService] Obteniendo ejercicio desde:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: SingleExerciseResponse = await response.json();
      
      console.log(`✅ [ExerciseService] Ejercicio obtenido:`, result.data.ejercicio);
      
      return result.data;
    } catch (error) {
      console.error('❌ [ExerciseService] Error obteniendo ejercicio:', error);
      throw error;
    }
  }

  /**
   * Obtener ejercicios por grupo muscular específico
   */
  async getExercisesByGroup(group: string): Promise<ExerciseForRoutine[]> {
    return this.getExercises({ muscleGroup: group });
  }

  /**
   * Obtener ejercicios por tipo/categoría
   */
  async getExercisesByType(type: string): Promise<ExerciseForRoutine[]> {
    return this.getExercises({ type });
  }
}

export const exerciseService = new ExerciseService();
export default exerciseService;
