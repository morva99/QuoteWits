import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

function Header({ isAuthenticated, onLogin, onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-purple-600">QuoteWits</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link to="/">
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                  >
                    Генератор
                  </Button>
                </Link>
                
                <Link to="/collection">
                  <Button
                    variant={location.pathname === '/collection' ? 'default' : 'ghost'}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Моя коллекция
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            ) : (
              <Button onClick={onLogin}>
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
            )}
          </nav>

          {/* Mobile Burger Button */}
          <div className="flex md:hidden items-center gap-2 relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-all hover:scale-110"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            ) : (
              <Button onClick={onLogin}>
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
            )}

            {/* Mobile Menu Dropdown - раскрывается вниз */}
            <AnimatePresence>
              {isMobileMenuOpen && isAuthenticated && (
                <motion.nav 
                  className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8, 
                    y: -20
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8, 
                    y: -20
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  style={{
                    transformOrigin: "top right"
                  }}
                >
                  <div className="flex flex-col py-2 min-w-[220px] px-2">
                    <Link 
                      to="/" 
                      onClick={closeMobileMenu}
                      className={`block w-full text-left px-6 py-3 transition-colors cursor-pointer rounded-md ${
                        location.pathname === '/' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Генератор
                    </Link>
                    
                    <Link 
                      to="/collection" 
                      onClick={closeMobileMenu}
                      className={`flex items-center w-full text-left px-6 py-3 transition-colors cursor-pointer rounded-md whitespace-nowrap ${
                        location.pathname === '/collection' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Моя коллекция</span>
                    </Link>

                    <button
                      onClick={(e) => { e.stopPropagation(); closeMobileMenu(); onLogout(); }}
                      className="flex items-center w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200 mt-2 pt-3 cursor-pointer rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                      Выйти
                    </button>
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Backdrop для закрытия меню при клике вне его */}
      <AnimatePresence>
        {isMobileMenuOpen && isAuthenticated && (
          <motion.div 
            className="fixed inset-0 z-20 md:hidden bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
