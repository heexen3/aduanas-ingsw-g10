import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  pageTitle: string;
}

export function AppLayout({ children, currentPage, onNavigate, pageTitle }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay">
          <div
            className="sidebar-overlay__backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <Sidebar
            currentPage={currentPage}
            onNavigate={onNavigate}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Desktop Fijo Sidebar */}
      <div className="app-layout__sidebar-desktop">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      </div>

      {/* Main Area */}
      <div className="app-layout__main">
        <Header pageTitle={pageTitle} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="app-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}
