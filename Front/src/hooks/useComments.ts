// hooks/useComments.ts
import { useEffect, useState } from "react";
import { AllCommentService } from "@/services/AllCommentService";
import { useAuth } from "@/context/AuthContext";
import { Comentary } from "@/types";

export function useComments() {
  const { userData } = useAuth();
  const [comments, setComments] = useState<Comentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      if (!userData?.token) {
        setError(
          "No estás autenticado. Inicia sesión para ver los comentarios."
        );
        setComments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await AllCommentService.getAllComments();
        if (mounted) setComments(result);
      } catch (err) {
        if (mounted) {
          console.error("❌ Error cargando comentarios:", err);
          setError(err instanceof Error ? err.message : "Error desconocido");
          setComments([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchComments();

    return () => {
      mounted = false;
    };
  }, [userData?.token]);

  return { comments, loading, error };
}
