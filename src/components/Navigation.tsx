
import { useState } from 'react';
import { Menu, X, Github, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projekte', href: '/projects' },
    { name: 'Skills', href: '/skills' },
    { name: 'Automatisierung', href: '/automation' },
    { name: 'Kontakt', href: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">
              System Engineer
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/chat"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              <MessageCircle size={16} className="mr-2" />
              Chat with AI
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              <Link
                to="/chat"
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full mb-3 transition-all duration-200 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle size={16} className="mr-2" />
                Chat with AI
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
