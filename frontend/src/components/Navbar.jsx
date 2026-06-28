import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          <ChefHat size={32} />
          <span>CraveCampus</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-primary">
            <User size={18} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
