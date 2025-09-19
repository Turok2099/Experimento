import type { User } from "../types/index"

export const usersDataMock: User[] = [
    {
        id: 1,
        name: "Carlos Pérez",
        email: "carlos.perez@email.com",
        password: "12345678",
        address: "Calle 123, Bogotá",
        phone: "3001234567",
    },
    {
        id: 2,
        name: "María Gómez",
        email: "maria.gomez@email.com",
        password: "abcdef12",
        address: "Cra 45 #10-25, Medellín",
        phone: "3109876543",
    },
    {
        id: 3,
        name: "Juan Rodríguez",
        email: "juan.rodriguez@email.com",
        password: "qwerty99",
        address: "Av. Siempre Viva 742, Cali",
        phone: "3154567890",
    },
    {
        id: 4,
        name: "Ana Martínez",
        email: "ana.martinez@email.com",
        password: "password01",
        address: "Transversal 7 #55-20, Barranquilla",
        phone: "3012345678",
    },
]
