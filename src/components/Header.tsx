import Link from 'next/link';
import { Ticket, UserCog, Landmark, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 no-print">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-xl font-headline font-bold text-primary hover:text-accent transition-colors">
          <Ticket className="h-6 w-6" />
          Tómbola Mágica
        </Link>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost">
            <Link href="/funds">
              <Landmark className="mr-2 h-4 w-4" />
              Fondos
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/withdrawals">
              <History className="mr-2 h-4 w-4" />
              Retiros
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin">
              <UserCog className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
