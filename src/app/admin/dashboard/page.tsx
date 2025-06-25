import AdminDashboard from '@/components/admin/AdminDashboard';
import { getFunds, getAllWinners, getWithdrawals } from '@/lib/data';

export default async function DashboardPage() {
    const funds = await getFunds();
    const winners = await getAllWinners();
    const withdrawals = await getWithdrawals();

    return (
        <AdminDashboard
            initialFunds={funds}
            initialWinners={winners}
            initialWithdrawals={withdrawals}
        />
    );
}
