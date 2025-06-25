import AdminDashboard from '@/components/admin/AdminDashboard';
import { getParticipants, getFunds, getAllWinners, getWithdrawals } from '@/lib/data';

export default async function DashboardPage() {
    const participants = await getParticipants();
    const funds = await getFunds();
    const winners = await getAllWinners();
    const withdrawals = await getWithdrawals();

    return (
        <AdminDashboard
            initialParticipants={participants}
            initialFunds={funds}
            initialWinners={winners}
            initialWithdrawals={withdrawals}
        />
    );
}
