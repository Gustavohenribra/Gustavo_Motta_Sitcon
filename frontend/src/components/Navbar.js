import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar w-nav" data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner">
      <div className="w-container">
        <a href="/" className={`brand w-clearfix w-nav-brand ${isActive('/') ? 'w--current' : ''}`}>
          <div className="logo-text">MedConnect</div>
        </a>
        <nav role="navigation" className="nav-menu w-nav-menu">
          <a href="/" className={`nav-link w-nav-link ${isActive('/') ? 'w--current' : ''}`}>Inicio</a>
          <a href="/listagem-paciente" className={`nav-link w-nav-link ${isActive('/listagem-paciente') ? 'w--current' : ''}`}>Listagem de paciente</a>
          <a href="/listagem-solicitacao" className={`nav-link w-nav-link ${isActive('/listagem-solicitacao') ? 'w--current' : ''}`}>Listagem de Solicitação</a>
        </nav>
        <div className="menu-button w-nav-button">
          <div className="menu-icon w-icon-nav-menu"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
