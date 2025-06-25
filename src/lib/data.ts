// In a real application, this file would contain functions
// to interact with a database like Firestore.

const MOCK_PARTICIPANTS = [
    "Ana Torres", "Luis Garcia", "Maria Rodriguez", "Juan Martinez", "Sofia Hernandez",
    "Carlos Gonzalez", "Laura Perez", "Jose Lopez", "Carmen Sanchez", "David Ramirez",
    "Ana Torres", "Elena Gomez", "Javier Diaz", "Isabel Vazquez", "Miguel Ruiz",
    "Patricia Alvarez", "Francisco Moreno", "Raquel Jimenez", "Daniel Muñoz", "Sara Alonso",
    "Carlos Gonzalez", "Sergio Castro", "Andrea Ortega", "Jorge Rubio", "Lucia Gil",
    "Fernando Soto", "Marta Nuñez", "Ricardo Medina", "Silvia Castillo", "Juan Martinez"
];

const MOCK_FUNDS = {
    total: 15000,
    withdrawn: 3500,
};

const MOCK_WINNERS = [
    { name: "Sofia Hernandez", date: "2024-05-20" },
    { name: "David Ramirez", date: "2024-05-13" },
    { name: "Maria Rodriguez", date: "2024-05-06" },
    { name: "Carlos Gonzalez", date: "2024-04-29" },
    { name: "Ana Torres", date: "2024-04-22" },
];

export async function getParticipants(): Promise<string[]> {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 50));
    return MOCK_PARTICIPANTS;
}

export async function getFunds(): Promise<{ total: number; withdrawn: number }> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_FUNDS;
}

export async function getRecentWinners(): Promise<{ name: string; date: string }[]> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_WINNERS.slice(0, 3);
}

export async function getAllWinners(): Promise<{ name: string; date: string }[]> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_WINNERS;
}

// In a real app, you would have functions like these:
// export async function addParticipant(name: string) { ... }
// export async function updateFunds(funds: { total: number; withdrawn: number }) { ... }
// export async function addWinner(winner: { name: string; date: string }) { ... }
