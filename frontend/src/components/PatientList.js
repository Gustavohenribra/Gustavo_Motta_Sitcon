import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as ArrowLeft } from '../images/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../images/arrow-right.svg';


const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allPatients, setAllPatients] = useState([]);

  useEffect(() => {
    const loadAllPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pacientes/todos');
        setAllPatients(response.data); // Armazenando todos os pacientes
      } catch (error) {
        console.error('Erro ao buscar todos os pacientes:', error);
      }
    };
  
    loadAllPatients();
  }, []);

  useEffect(() => {
    const loadPatients = async () => {
      const response = await axios.get(`http://localhost:3001/api/pacientes?page=${currentPage}`);
      setPatients(response.data.data);
      setTotalPages(response.data.totalPages);
    };

    loadPatients();
  }, [currentPage]);

  const [searchTerm, setSearchTerm] = useState('');

  // Função para atualizar a pesquisa e o filtro
  const updateSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  
  // Filtre os pacientes para que a busca seja correspondida desde o início do nome
  const filteredPatients = searchTerm
  ? allPatients.filter(patient =>
      patient.nome.toLowerCase().startsWith(searchTerm) || 
      patient.CPF.startsWith(searchTerm)
    )
  : patients;

  return (
    <div className="section-pacientes">
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={updateSearch}
        className="search-input"
      />
    </div>
      <div className="div-block-principal">
        <div className="div-block-container">
          <table className="tabela-pacientes">
            <thead>
              <tr>
              <th className="cabecalho-tabela">Paciente</th>
                <th className="cabecalho-tabela">Nascimento</th>
                <th className="cabecalho-tabela">CPF</th>
                <th className="cabecalho-tabela">Ações</th>
            </tr>
            </thead>  
            <tbody>
            {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.nome}</td>
                  <td>{patient.dataNasc}</td>
                  <td>{patient.CPF}</td>
                  <td>
                    <button className='btn-ver-mais'>Ver Mais</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='pagination-container'>
          <div className="pagination-controls">
        <button className="pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        <ArrowLeft />
        </button>
        {[...Array(totalPages).keys()].map(pageNum =>
            <button
            key={pageNum}
            className={`page-number ${currentPage === pageNum + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(pageNum + 1)}
            >
            {pageNum + 1}
            </button>
        )}
        <button className="pagination-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
        <ArrowRight />
        </button>
        </div>
        </div>
        </div>
      </div>
    </div>
  );  
};
    
export default PatientList;
