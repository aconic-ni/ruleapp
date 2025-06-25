
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, orderBy, limit, query, where } from 'firebase/firestore';

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
                    date: data.drawDate.toDate().toISOString().split('T')[0],
                });
            }
        });
    } catch (error) {
        console.error("Error fetching all winners: ", error);
    }
    return winners;
}

export async function getRaffleById(id: string): Promise<Raffle | null> {
    try {
        const docRef = doc(db, 'ruletas', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                participants: data.participants,
                raffleTotal: data.raffleTotal,
                status: data.status,
                winner: data.winner,
                date: data.date.toDate().toISOString().split('T')[0],
                drawDate: data.drawDate ? data.drawDate.toDate().toISOString().split('T')[0] : undefined,
            };
        } else {
            console.log("No such raffle document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching raffle by ID: ", error);
        return null;
    }
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

export async function getWithdrawalById(id: string): Promise<Withdrawal | null> {
    try {
        const docRef = doc(db, 'retiros', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                solicitudId: data.solicitudId,
                name: data.name,
                amount: data.amount,
                declaration: data.declaration,
                date: data.date.toDate().toISOString().split('T')[0],
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching withdrawal by ID: ", error);
        return null;
    }
}
