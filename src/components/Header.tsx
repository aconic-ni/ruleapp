"use client";

import Link from 'next/link';
import { Ticket, UserCog, Landmark, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 no-print">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-xl font-headline font-bold text-primary hover:text-accent transition-colors">
          <Ticket className="h-6 w-6" />
          RuleApp
        </Link>
        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/funds">
                    <Landmark className="h-5 w-5" />
                    <span className="sr-only">Fondos</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fondos</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/withdrawals">
                    <History className="h-5 w-5" />
                    <span className="sr-only">Retiros</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Retiros</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/admin">
                    <UserCog className="h-5 w-5" />
                    <span className="sr-only">Admin</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Admin</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </nav>
    </header>
  );
}
