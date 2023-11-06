import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar w-nav" data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner">
      <div className="w-container">
        <a href="index.html" className="brand w-clearfix w-nav-brand">
          <div className="logo-text">MedConnect</div>
        </a>
        <nav role="navigation" className="nav-menu w-nav-menu">
          <a href="inicio" className="nav-link w-nav-link w--current">Inicio</a>
          <a href="listagem-paciente" className="nav-link w-nav-link">Listagem de paciente</a>
          <a href="listagem-solicitacao" aria-current="page" className="nav-link w-nav-link">Listagem de Solicitação</a>
        </nav>
        <div className="menu-button w-nav-button">
          <div className="menu-icon w-icon-nav-menu"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
