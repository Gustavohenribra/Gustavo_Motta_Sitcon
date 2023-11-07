// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import PatientListPage from './components/PatientListPage';

const App = () => {
  return (
    <div className="main-container">
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listagem-paciente" element={<PatientListPage />} />
        <Route path="/listagem-solicitacao" element={<Home />} />
        <Route path="/socilitacao-clinica" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
};

export default App;
