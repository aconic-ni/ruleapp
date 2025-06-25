
'use server';

import { db } from './firebase';
import { collection, addDoc, doc, getDoc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Participant, Withdrawal } from './data';

// Ensure the funds summary document exists
async function ensureFundsSummaryExists() {
    const fundsRef = doc(db, 'funds', 'summary');
    const fundsSnap = await getDoc(fundsRef);
    if (!fundsSnap.exists()) {
        await setDoc(fundsRef, { total: 0, withdrawn: 0 });
    }
    return fundsRef;
}

// Action to save a completed raffle and update funds
export async function saveRaffle(winnerName: string, participants: Participant[]) {
    if (!winnerName || participants.length === 0) {
        throw new Error("Winner and participants are required.");
    }
    
    try {
        // 1. Calculate the total value from this raffle's tickets
        const raffleTotal = participants.reduce((sum, p) => sum + p.ticketValue, 0);

        // 2. Add the raffle record to the 'ruletas' collection
        await addDoc(collection(db, 'ruletas'), {
            winner: winnerName,
            participants: participants,
            date: Timestamp.now(),
            raffleTotal: raffleTotal
        });

        // 3. Atomically update the total funds in the summary document
        const fundsRef = await ensureFundsSummaryExists();
        await updateDoc(fundsRef, {
            total: increment(raffleTotal)
        });

        // 4. Revalidate paths to show updated data
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/funds');

    } catch (error) {
        console.error("Error saving raffle: ", error);
        throw new Error("Could not save raffle to the database.");
    }
}


// Action to add a withdrawal and update funds
export async function addWithdrawal(withdrawalRequest: Omit<Withdrawal, 'id' | 'date'>) {
    if (!withdrawalRequest.name || withdrawalRequest.amount <= 0) {
        throw new Error("Invalid withdrawal data.");
    }

    try {
        const withdrawalData = {
            ...withdrawalRequest,
            date: Timestamp.now(),
        };

        // 1. Add the withdrawal record to the 'retiros' collection
        await addDoc(collection(db, 'retiros'), withdrawalData);

        // 2. Atomically update the withdrawn amount in the summary document
        const fundsRef = await ensureFundsSummaryExists();
        await updateDoc(fundsRef, {
            withdrawn: increment(withdrawalRequest.amount)
        });

        // 3. Revalidate paths to show updated data
        revalidatePath('/admin/dashboard');
        revalidatePath('/funds');
        revalidatePath('/withdrawals');
        
    } catch (error) {
        console.error("Error adding withdrawal: ", error);
        throw new Error("Could not add withdrawal to the database.");
    }
}
