// In a real application, this file would contain functions
// to interact with a database like Firestore.

// Data is now managed by component state, initial state is empty.
const MOCK_PARTICIPANTS: Participant[] = [];

const MOCK_FUNDS: Funds = {
    total: 0,
    withdrawn: 0,
};

const MOCK_WINNERS: Winner[] = [];

const MOCK_WITHDRAWALS: Withdrawal[] = [];

export interface Participant {
    name: string;
    ticketValue: number;
    number: number;
}

export interface Funds {
    total: number;
    withdrawn: number;
}

export interface Winner {
    name: string;
    date: string;
}

export interface Withdrawal {
    id: string; // Auto-generated
    solicitudId: string; // User-provided
    name: string;
    amount: number;
    declaration: string;
    date: string;
}

export async function getParticipants(): Promise<Participant[]> {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 50));
    return MOCK_PARTICIPANTS;
}

export async function getFunds(): Promise<Funds> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_FUNDS;
}

export async function getRecentWinners(): Promise<Winner[]> {
    await new Promise(res => setTimeout(res, 50));
    // In a real app, you'd fetch and sort by date descending
    return MOCK_WINNERS.slice(0, 3);
}

export async function getAllWinners(): Promise<Winner[]> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_WINNERS;
}

export async function getWithdrawals(): Promise<Withdrawal[]> {
    await new Promise(res => setTimeout(res, 50));
    return MOCK_WITHDRAWALS;
}

// In a real app, you would have functions like these:
// export async function addParticipant(participant: Participant) { ... }
// export async function updateFunds(funds: Funds) { ... }
// export async function addWinner(winner: Winner) { ... }
// export async function addWithdrawal(withdrawal: Omit<Withdrawal, 'id' | 'date'>) { ... }