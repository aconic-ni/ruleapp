import AdminDashboard from '@/components/admin/AdminDashboard';
import { getParticipants, getFunds, getAllWinners } from '@/lib/data';

export default async function DashboardPage() {
    const participants = await getParticipants();
    const funds = await getFunds();
    const winners = await getAllWinners();

    return (
        <AdminDashboard
            initialParticipants={participants}
            initialFunds={funds}
            initialWinners={winners}
        />
    );
}
