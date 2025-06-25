
'use server';

import { db } from './firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Participant, Withdrawal } from './data';

// Ensure the funds summary document exists
async function ensureFundsSummaryExists() {
    const fundsRef = db.collection('funds').doc('summary');
    const fundsSnap = await fundsRef.get();
    if (!fundsSnap.exists) {
        await fundsRef.set({ total: 0, withdrawn: 0 });
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
        const raffleDocRef = await db.collection('ruletas').add({
            participants: participants,
            raffleTotal: raffleTotal,
            date: Timestamp.now(), // Creation date
            status: 'pending'
        });

        // 3. Atomically update the total funds in the summary document
        const fundsRef = await ensureFundsSummaryExists();
        await fundsRef.update({
            total: FieldValue.increment(raffleTotal)
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
        const raffleRef = db.collection('ruletas').doc(raffleId);

        // Update the document with the winner and the draw date
        await raffleRef.update({
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
        await db.collection('retiros').add(withdrawalData);

        // 2. Atomically update the withdrawn amount in the summary document
        const fundsRef = await ensureFundsSummaryExists();
        await fundsRef.update({
            withdrawn: FieldValue.increment(withdrawalRequest.amount)
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

