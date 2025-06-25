import { db } from './firebase';
import { collection, doc, addDoc, updateDoc, getDoc, runTransaction, Timestamp } from 'firebase/firestore';
import type { Participant, Withdrawal, Raffle } from './data';

export async function createRaffle(participants: Participant[]): Promise<string> {
    if (participants.length === 0) {
        throw new Error("Participants are required to create a raffle.");
    }
    
    try {
        const raffleTotal = participants.reduce((sum, p) => sum + p.ticketValue, 0);
        
        const fundsRef = doc(db, 'funds', 'summary');

        const raffleDocRef = await runTransaction(db, async (transaction) => {
            const fundsSnap = await transaction.get(fundsRef);
            if (!fundsSnap.exists()) {
                transaction.set(fundsRef, { total: raffleTotal, withdrawn: 0 });
            } else {
                const currentTotal = fundsSnap.data().total || 0;
                transaction.update(fundsRef, { total: currentTotal + raffleTotal });
            }

            const newRaffleRef = doc(collection(db, 'ruletas'));
            transaction.set(newRaffleRef, {
                participants,
                raffleTotal,
                date: Timestamp.now(),
                status: 'pending',
            });
            return newRaffleRef;
        });
        
        return raffleDocRef.id;

    } catch (error) {
        console.error("Error creating raffle: ", error);
        throw new Error("Could not create raffle in the database.");
    }
}

export async function setRaffleWinner(raffleId: string, winnerName: string): Promise<void> {
    if (!raffleId || !winnerName) {
        throw new Error("Raffle ID and winner name are required.");
    }

    try {
        const raffleRef = doc(db, 'ruletas', raffleId);
        await updateDoc(raffleRef, {
            winner: winnerName,
            drawDate: Timestamp.now(),
            status: 'completed'
        });
    } catch (error) {
        console.error("Error setting raffle winner: ", error);
        throw new Error("Could not update raffle with the winner.");
    }
}

export async function addWithdrawal(withdrawalRequest: Omit<Withdrawal, 'id' | 'date'>): Promise<void> {
    if (!withdrawalRequest.name || withdrawalRequest.amount <= 0) {
        throw new Error("Invalid withdrawal data.");
    }

    try {
        const fundsRef = doc(db, 'funds', 'summary');
        
        await runTransaction(db, async (transaction) => {
            const fundsSnap = await transaction.get(fundsRef);
            if (!fundsSnap.exists()) {
                throw new Error("Funds summary document does not exist!");
            }
            const currentWithdrawn = fundsSnap.data()?.withdrawn || 0;
            transaction.update(fundsRef, { withdrawn: currentWithdrawn + withdrawalRequest.amount });

            const newWithdrawalRef = doc(collection(db, 'retiros'));
            transaction.set(newWithdrawalRef, {
                ...withdrawalRequest,
                date: Timestamp.now(),
            });
        });

    } catch (error) {
        console.error("Error adding withdrawal: ", error);
        throw new Error("Could not add withdrawal to the database.");
    }
}

export async function getRaffleById(id: string): Promise<Raffle | null> {
    try {
        const docRef = doc(db, 'ruletas', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!data) return null;
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
            return null;
        }
    } catch (error) {
        console.error("Error fetching raffle by ID: ", error);
        return null;
    }
}

export async function getWithdrawalById(id: string): Promise<Withdrawal | null> {
    try {
        const docRef = doc(db, 'retiros', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!data) return null;
            return {
                id: docSnap.id,
                solicitudId: data.solicitudId,
                name: data.name,
                amount: data.amount,
                declaration: data.declaration,
                observation: data.observation || '',
                date: data.date.toDate().toISOString().split('T')[0],
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching withdrawal by ID: ", error);
        return null;
    }
}
