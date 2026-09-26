import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';
import type { PageId, UserProfile } from '../../types';

interface LayoutProps {
  activePage: PageId;
  user: UserProfile | null;
  onNavigate: (page: PageId) => void;
  onSignOut?: () => void;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activePage,
  user,
  onNavigate,
  onSignOut,
  children,
}) => {
  if (activePage === 'landing' || activePage === 'auth') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-slate-900">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          activePage={activePage}
          user={user}
          onNavigate={onNavigate}
          onTriggerEmergency={() => onNavigate('emergency')}
          onSignOut={onSignOut}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      <MobileNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
};
