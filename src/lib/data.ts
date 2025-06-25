// In a real application, this file would contain functions
// to interact with a database like Firestore.
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, orderBy, limit, query } from 'firebase/firestore';

// Data is now managed by component state, initial state is empty.
const MOCK_PARTICIPANTS: Participant[] = [];


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

// This function is kept for compatibility, but participant data is now client-side state
// until a raffle is completed.
export async function getParticipants(): Promise<Participant[]> {
    return MOCK_PARTICIPANTS;
}

export async function getFunds(): Promise<Funds> {
    try {
        const fundsDoc = await getDoc(doc(db, 'funds', 'summary'));
        if (fundsDoc.exists()) {
            return fundsDoc.data() as Funds;
        }
    } catch (error) {
        console.error("Error fetching funds: ", error);
    }
    // Return default if doc doesn't exist or on error
    return { total: 0, withdrawn: 0 };
}

export async function getRecentWinners(): Promise<Winner[]> {
    const winners: Winner[] = [];
    try {
        const q = query(collection(db, 'ruletas'), orderBy('date', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            winners.push({
                name: data.winner,
                date: data.date.toDate().toISOString().split('T')[0],
            });
        });
    } catch (error) {
        console.error("Error fetching recent winners: ", error);
    }
    return winners;
}

export async function getAllWinners(): Promise<Winner[]> {
    const winners: Winner[] = [];
     try {
        const q = query(collection(db, 'ruletas'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            winners.push({
                name: data.winner,
                date: data.date.toDate().toISOString().split('T')[0],
            });
        });
    } catch (error) {
        console.error("Error fetching all winners: ", error);
    }
    return winners;
}

export async function getWithdrawals(): Promise<Withdrawal[]> {
    const withdrawals: Withdrawal[] = [];
    try {
        const q = query(collection(db, 'retiros'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            withdrawals.push({
                id: doc.id,
                solicitudId: data.solicitudId,
                name: data.name,
                amount: data.amount,
                declaration: data.declaration,
                date: data.date.toDate().toISOString().split('T')[0],
            });
        });
    } catch (error) {
        console.error("Error fetching withdrawals: ", error);
    }
    return withdrawals;
}
