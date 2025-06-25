
import { db } from './firebase-admin';

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
    date: string;
}


export async function getFunds(): Promise<Funds> {
    try {
        const fundsDoc = await db.collection('funds').doc('summary').get();
        if (fundsDoc.exists) {
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
        const querySnapshot = await db.collection('ruletas')
            .where('status', '==', 'completed')
            .orderBy('drawDate', 'desc')
            .limit(3)
            .get();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.winner && data.drawDate) {
                winners.push({
                    name: data.winner,
                    date: data.drawDate.toDate().toISOString().split('T')[0],
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
     try {
        const querySnapshot = await db.collection('ruletas')
            .where('status', '==', 'completed')
            .orderBy('drawDate', 'desc')
            .get();
            
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if(data.winner && data.drawDate) {
                winners.push({
                    name: data.winner,
                    date: data.drawDate.toDate().toISOString().split('T')[0],
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
    try {
        const querySnapshot = await db.collection('retiros').orderBy('date', 'desc').get();
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
