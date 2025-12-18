import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/movimiento', label: 'Nuevo Movimiento', icon: '➕' },
    { path: '/reportes', label: 'Reportes', icon: '📊' },
    { path: '/perfil', label: 'Perfil', icon: '👤' }
  ];

  // No mostrar navbar en páginas públicas
  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-primary to-primary/80 backdrop-blur-sm shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white font-bold text-xl hover:text-accent transition-colors duration-200"
            >
              <span className="text-2xl">💰</span>
              <span className="hidden sm:block">Sistema Balance</span>
            </Link>
          </div>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        isActivePath(link.path)
                          ? 'bg-white/20 text-white shadow-md'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Menu - Desktop */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-white/80 text-sm">
                      Hola, <span className="font-semibold text-white">{user?.nombre || 'Usuario'}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-accent/90 hover:bg-accent text-gray-800 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
                >
                  <span className="sr-only">Abrir menú principal</span>
                  {!isMenuOpen ? (
                    <span className="text-xl">☰</span>
                  ) : (
                    <span className="text-xl">✕</span>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Auth Links for non-authenticated users */
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActivePath('/login')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                🔑 Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/30 ${
                  isActivePath('/register')
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white hover:text-primary'
                }`}
              >
                📝 Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {user && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-primary/90 rounded-lg mt-2 border border-white/20">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                    isActivePath(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="border-t border-white/20 mt-3 pt-3">
                <div className="px-3 py-2 text-white/60 text-sm">
                  {user?.nombre || 'Usuario'}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="text-lg">🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
