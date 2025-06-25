import { db, auth } from './firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

// Define types
export interface Participant {
    name: string;
    ticketValue: number;
    number: number;
}

export interface Raffle {
    id: string;
    participants: Participant[];
    raffleTotal: number;
    date: string; // Creation date
    status: 'pending' | 'completed';
    winner?: string;
    drawDate?: string; // Draw date
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
    observation: string;
    date: string;
}

function formatDate(timestamp: Timestamp): string {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}


export async function getFunds(): Promise<Funds> {
    if (!db) return { total: 0, withdrawn: 0 };
    try {
        const fundsDocRef = doc(db, 'funds', 'summary');
        const fundsDoc = await getDoc(fundsDocRef);
        if (fundsDoc.exists()) {
            return fundsDoc.data() as Funds;
        }
    } catch (error) {
        console.error("Error fetching funds: ", error);
    }
    return { total: 0, withdrawn: 0 };
}

export async function getRecentWinners(): Promise<Winner[]> {
    const winners: Winner[] = [];
    if (!db) return winners;
    try {
        const q = query(
            collection(db, 'ruletas'),
            where('status', '==', 'completed'),
            orderBy('drawDate', 'desc'),
            limit(3)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.winner && data.drawDate) {
                winners.push({
                    name: data.winner,
                    date: formatDate(data.drawDate),
                });
            }
        });
    } catch (error) {
        console.error("Error fetching recent winners: ", error);
    }
    return winners;
}

export async function getAllWinners(): Promise<Winner[]> {
    const winners: Winner[] = [];
    if (!db) return winners;
     try {
        const q = query(
            collection(db, 'ruletas'),
            where('status', '==', 'completed'),
            orderBy('drawDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
            
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data.winner && data.drawDate) {
                winners.push({
                    name: data.winner,
                    date: formatDate(data.drawDate),
                });
            }
        });
    } catch (error) {
        console.error("Error fetching all winners: ", error);
    }
    return winners;
}

export async function getWithdrawals(): Promise<Withdrawal[]> {
    const withdrawals: Withdrawal[] = [];
    if (!db) return withdrawals;
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
                observation: data.observation || '',
                date: formatDate(data.date),
            });
        });
    } catch (error) {
        console.error("Error fetching withdrawals: ", error);
    }
    return withdrawals;
}

export async function getAllRaffles(): Promise<Raffle[]> {
    const raffles: Raffle[] = [];
    if (!db) {
        return raffles;
    }
    try {
        const q = query(collection(db, 'ruletas'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            raffles.push({
                id: docSnap.id,
                participants: data.participants,
                raffleTotal: data.raffleTotal,
                status: data.status,
                winner: data.winner,
                date: formatDate(data.date),
                drawDate: data.drawDate ? formatDate(data.drawDate) : undefined,
            });
        });
    } catch (error) {
        console.error("Error fetching all raffles: ", error);
    }
    return raffles;
}
