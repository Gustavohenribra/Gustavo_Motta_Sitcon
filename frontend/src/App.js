// App.js
import React from 'react';
import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import ContactInfo from './components/ContactInfo';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <>
      <Navbar />
      <MainSection />
      <ContactInfo />
      <Footer />
    </>
  );
};

export default App;
