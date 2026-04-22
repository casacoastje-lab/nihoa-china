import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className={cn("flex-grow", !isHome && !isMap && "pt-24 sm:pt-28")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
