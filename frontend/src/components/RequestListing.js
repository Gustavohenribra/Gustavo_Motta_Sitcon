import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as ArrowLeft } from '../images/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../images/arrow-right.svg';

const RequestListing = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const solicitacoesPorPagina = 10;


  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/solicitacoesClinicas');
        setSolicitacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar as solicitações clínicas', error);
      }
    };

    fetchSolicitacoes();
  }, []);

  const updateSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const getFilteredRequests = () => {
    if (!searchTerm) {
      return solicitacoes;
    }
    return solicitacoes.filter(solicitacao =>
      solicitacao.paciente_nome.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      solicitacao.profissional_nome.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      solicitacao.tipo_solicitacao_descricao.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      solicitacao.procedimentos_descricao.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      solicitacao.data.startsWith(searchTerm) ||
      solicitacao.hora.startsWith(searchTerm) ||
      (solicitacao.observacoes && solicitacao.observacoes.toLowerCase().startsWith(searchTerm.toLowerCase()))
    );
  };

  const filteredRequests = getFilteredRequests();
  const totalPages = Math.ceil(filteredRequests.length / solicitacoesPorPagina);
  const indexOfLastSolicitacao = currentPage * solicitacoesPorPagina;
  const indexOfFirstSolicitacao = indexOfLastSolicitacao - solicitacoesPorPagina;
  const currentSolicitacoes = filteredRequests.slice(indexOfFirstSolicitacao, indexOfLastSolicitacao);

  return (
    <div className="section-solicitacoes">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar solicitação..."
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
                <th className="cabecalho-tabela">Profissional</th>
                <th className="cabecalho-tabela">Tipo de Solicitação</th>
                <th className="cabecalho-tabela">Procedimento</th>
                <th className="cabecalho-tabela">Data</th>
                <th className="cabecalho-tabela">Hora</th>
                <th className="cabecalho-tabela">Observações</th>
              </tr>
            </thead>  
            <tbody>
        {currentSolicitacoes.map((solicitacao) => (
          <tr key={solicitacao.id}>
            <td>{solicitacao.paciente_nome}</td>
            <td>{solicitacao.profissional_nome}</td>
            <td>{solicitacao.tipo_solicitacao_descricao}</td>
            <td title={solicitacao.procedimentos_descricao}>{solicitacao.procedimentos_descricao}</td>
            <td>{solicitacao.data}</td>
            <td>{solicitacao.hora}</td>
            <td title={solicitacao.observacoes}>{solicitacao.observacoes}</td>
          </tr>
        ))}
      </tbody>
          </table>
          <div className='pagination-container'>
        <div className="pagination-controls">
          <button className="pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <ArrowLeft />
          </button>
          {[...Array(totalPages).keys()].map(pageNum => (
            <button
              key={pageNum}
              className={`page-number ${currentPage === pageNum + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(pageNum + 1)}
            >
              {pageNum + 1}
            </button>
          ))}
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

export default RequestListing;