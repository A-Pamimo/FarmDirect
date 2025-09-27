import { Link, NavLink, Outlet } from 'react-router-dom';
import { ToastCenter } from './Toast';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition ${
    isActive ? 'bg-brand-primary text-white' : 'text-brand-text/80 hover:bg-white'
  }`;

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg">
      <ToastCenter />
      <header className="sticky top-0 z-40 bg-brand-bg/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-playfair text-2xl text-brand-primary">
            HarvestLink
          </Link>
          <nav className="flex items-center space-x-2">
            <NavLink to="/discover" className={navLinkClass}>
              Discover
            </NavLink>
            <NavLink to="/farmer/f1f1f1f1-1111-4111-8111-aaaaaaaaaaaa/deliveries" className={navLinkClass}>
              Farmer View
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="bg-brand-bg/70 border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-brand-text/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} HarvestLink. Farmers are brands — not SKUs.</p>
          <p>Demo postal codes: S7N 0W5 · M5V 2T6 · V6B 1A1</p>
        </div>
      </footer>
    </div>
  );
};
