
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

// Action to create a new raffle document and update funds
export async function createRaffle(participants: Participant[]) {
    if (participants.length === 0) {
        throw new Error("Participants are required to create a raffle.");
    }
    
    try {
        // 1. Calculate the total value from this raffle's tickets
        const raffleTotal = participants.reduce((sum, p) => sum + p.ticketValue, 0);

        // 2. Add the raffle record to the 'ruletas' collection
        const raffleDocRef = await addDoc(collection(db, 'ruletas'), {
            participants: participants,
            raffleTotal: raffleTotal,
            date: Timestamp.now(), // Creation date
            status: 'pending'
        });

        // 3. Atomically update the total funds in the summary document
        const fundsRef = await ensureFundsSummaryExists();
        await updateDoc(fundsRef, {
            total: increment(raffleTotal)
        });

        // 4. Revalidate paths to show updated data
        revalidatePath('/admin/dashboard');
        revalidatePath('/funds');
        
        // 5. Return the new raffle's ID
        return raffleDocRef.id;

    } catch (error) {
        console.error("Error creating raffle: ", error);
        throw new Error("Could not create raffle in the database.");
    }
}

// Action to set the winner for an existing raffle
export async function setRaffleWinner(raffleId: string, winnerName: string) {
    if (!raffleId || !winnerName) {
        throw new Error("Raffle ID and winner name are required.");
    }

    try {
        const raffleRef = doc(db, 'ruletas', raffleId);

        // Update the document with the winner and the draw date
        await updateDoc(raffleRef, {
            winner: winnerName,
            drawDate: Timestamp.now(),
            status: 'completed'
        });

        // Revalidate paths to show updated winner history
        revalidatePath('/');
        revalidatePath('/admin/dashboard');

    } catch (error) {
        console.error("Error setting raffle winner: ", error);
        throw new Error("Could not update raffle with the winner.");
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

