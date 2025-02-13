import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    // Add event listener to close the mobile menu when clicking outside
    const handleOutsideClick = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.navbar')) {
        closeMobileMenu();
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleOutsideClick);

    // Remove event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={closeMobileMenu}>
        FormBuilder AEC
      </Link>

      <div className={`menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" onClick={closeMobileMenu}>
          Home
        </Link>
        <Link to="/add-form" onClick={closeMobileMenu}>
          Create Form
        </Link>
        <Link to="/form-links" onClick={closeMobileMenu}>
          Form Links
        </Link>

        <Link to="/contact" onClick={closeMobileMenu}>
          <button className="book-meeting1">Book a Meeting</button>
        </Link>
      </div>

      <Link to="/contact">
      <button className="book-meeting">Book a Meeting</button>
        </Link>

      <div className={`mobile-menu-icon ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;