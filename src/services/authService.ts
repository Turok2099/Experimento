import { ILoginProps, IRegisterPayload } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegisterPayload) {
  try {
    const response = await fetch(`${APIURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro");
    }

    const parsedResponse = await response.json();

    // Debug: mostrar la respuesta del servidor
    console.log("Respuesta del servidor:", parsedResponse);

    if (parsedResponse?.user?.name && parsedResponse?.accessToken) {
      return parsedResponse;
    } else {
      console.error("Respuesta inesperada del servidor:", parsedResponse);
      throw new Error(
        `Registro de usuario fallido. Respuesta del servidor: ${JSON.stringify(
          parsedResponse
        )}`
      );
    }
  } catch (error: any) {
    throw new Error(error.message || "Error en el registro");
  }
}

export async function login(userData: ILoginProps) {
  try {
    const response = await fetch(`${APIURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Verificar si la respuesta fue exitosa (200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Credenciales inválidas");
    }

    const parsedResponse = await response.json();

    if (parsedResponse?.accessToken && parsedResponse?.user) {
      return parsedResponse;
    } else {
      throw new Error("Respuesta inválida del servidor");
    }
  } catch (error: any) {
    throw new Error(error.message || "Error en el login");
  }
}
