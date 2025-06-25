import Link from 'next/link';
import { Ticket, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-xl font-headline font-bold text-primary hover:text-accent transition-colors">
          <Ticket className="h-6 w-6" />
          Tómbola Mágica
        </Link>
        <Button asChild variant="ghost">
          <Link href="/admin">
            <UserCog className="mr-2 h-4 w-4" />
            Admin
          </Link>
        </Button>
      </nav>
    </header>
  );
}
