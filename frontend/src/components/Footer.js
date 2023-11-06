// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <div className="section footer">
      <div className="w-container">
        <div className="w-row">
          <div className="w-col w-col-4">
            <div className="footer-text">2023 MedConnect</div>
          </div>
          <div className="w-col w-col-4">
            <a href="https://portifolio-gustavohenribra.vercel.app" className="button beige footer">Gustavo Motta</a>
          </div>
          <div className="w-col w-col-4">
            <div className="footer-text address">
              Rua Harmonia, 1234<br />
              Vila Madalena, São Paulo - SP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
