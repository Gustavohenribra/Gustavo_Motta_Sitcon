import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import '../styles/ClinicalRequest.css';

function applyDateMask(value) {
    let v = value.replace(/\D/g, "");
  
    let day = v.slice(0, 2);
    let month = v.slice(2, 4);
    let year = v.slice(4);
  
    if (parseInt(day, 10) > 31) {
      day = '31';
    }
  
    if (parseInt(month, 10) > 12) {
      month = '12';
    }
  
    v = day + (month.length ? '/' + month : '') + (year.length ? '/' + year : '');
  
    return v;
  }

  const animatedComponents = makeAnimated();

  function ClinicalRequest() {
    const navigate = useNavigate();
    const { patientId } = useParams();
    const [data, setData] = useState('');
    const [profissionais, setProfissionais] = useState([]);
    const [selectedProfissional, setSelectedProfissional] = useState('');
    const [tiposSolicitacaoMedico, setTiposSolicitacaoMedico] = useState([]);
    const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState([]);
    const [patient, setPatient] = useState({ nome: '', dataNasc: '', CPF: '' });
    const [tipoSolicitacao, setTipoSolicitacao] = useState('');
    const [procedimentosSelecionados, setProcedimentosSelecionados] = useState([]);
    const [hora, setHora] = useState('');
    const [observacoes, setObservacoes] = useState('');
    
  
    const procedimentosOptions = procedimentosDisponiveis.map((procedimento) => ({
      value: procedimento.id,
      label: procedimento.descricao
    }));
  

    useEffect(() => {
      async function fetchData() {
        try {
          const profResponse = await axios.get('http://localhost:3001/api/profissionais');
          setProfissionais(profResponse.data);
          
          if (patientId) {
            const patientResponse = await axios.get(`http://localhost:3001/api/pacientes/${patientId}`);
            setPatient(patientResponse.data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados', error);
        }
      }
  
      fetchData();
    }, [patientId]);
  
    useEffect(() => {
      async function fetchProcedimentos() {
        try {
          if (selectedProfissional) {
            const response = await axios.get(`http://localhost:3001/api/profissionais/${selectedProfissional}/procedimentos`);
            setProcedimentosDisponiveis(response.data);
            const tiposSolicitacaoUnicos = response.data.reduce((acc, procedimento) => {
              if (!acc.some(tipo => tipo.tipo_solicitacao_id === procedimento.tipo_solicitacao_id)) {
                acc.push({
                  tipo_solicitacao_id: procedimento.tipo_solicitacao_id,
                  tipo_solicitacao_descricao: procedimento.tipo_solicitacao_descricao
                });
              }
              return acc;
            }, []);
    
            setTiposSolicitacaoMedico(tiposSolicitacaoUnicos);
          }
        } catch (error) {
          console.error('Erro ao buscar procedimentos', error);
          setProcedimentosDisponiveis([]);
          setTiposSolicitacaoMedico([]);
        }
      }
    
      fetchProcedimentos();
    }, [selectedProfissional]);
    
    const handleTipoSolicitacaoChange = (e) => {
      setTipoSolicitacao(e.target.value);
      setProcedimentosSelecionados([]);
    };

    const handleProcedimentosChange = (selectedOption) => {
      if (Array.isArray(selectedOption)) {
        setProcedimentosSelecionados(selectedOption.map(option => option.value));
      } else {
        setProcedimentosSelecionados(selectedOption ? [selectedOption.value] : []);
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const procedimentosIdsArray = Array.isArray(procedimentosSelecionados)
    ? procedimentosSelecionados
    : [procedimentosSelecionados];

  try {
    const solicitacaoData = {
      paciente_id: patientId,
      profissional_id: selectedProfissional,
      tipo_solicitacao_id: tipoSolicitacao,
      procedimentos_ids: procedimentosIdsArray,
      data: data.split('/').reverse().join('-'),
      hora: hora,
      observacoes: observacoes,
      status: 'ativo'
    };
  
        await axios.post('http://localhost:3001/api/solicitacoesClinicas', solicitacaoData);
        alert('Solicitação clínica salva com sucesso!');
        navigate('/listagem-solicitacao');
      } catch (error) {
        console.error('Erro ao salvar a solicitação clínica', error);
        alert('Erro ao salvar a solicitação clínica. Por favor, tente novamente.');
      }
    };

    const handleDataChange = (event) => {
        setData(applyDateMask(event.target.value));
      };

  return (
    <div className="form-section">
      <div className="header">
        <button className="back-button" onClick={() => window.history.back()}>Voltar</button>
        <div className="title">Solicitações Clínicas</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex-container">
          <div className="form-group">
            <label htmlFor="patientName">Nome do Paciente</label>
            <input type="text" id="patientName" readOnly required value={patient.nome} />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Data de nascimento</label>
            <input type="date" id="birthDate" readOnly required value={patient.dataNasc.split('/').reverse().join('-')} />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" readOnly required value={patient.CPF} />
          </div>
        </div>
        
        <div className="attention-message">
          Atenção! Os Campos com * devem ser preenchidos obrigatoriamente.
        </div>
        
        <div className="form-group full-width">
        <label htmlFor="professional">Profissional*</label>
        <select 
          id="professional" 
          required
          value={selectedProfissional}
          onChange={(e) => setSelectedProfissional(e.target.value)}
        >
          <option value="">Selecione</option>
          {profissionais.map((profissional) => (
            <option key={profissional.id} value={profissional.id}>
              {profissional.nome}
            </option>
          ))}
        </select>
      </div>
        
      <div className="flex-container">
        <div className="form-group">
          <label htmlFor="requestType">Tipo de solicitação*</label>
          <select 
            id="requestType" 
            required 
            value={tipoSolicitacao} 
            onChange={handleTipoSolicitacaoChange}
          >
  <option value="">Selecione</option>
  {tiposSolicitacaoMedico.map((tipo) => (
    <option key={tipo.tipo_solicitacao_id} value={tipo.tipo_solicitacao_id}>
      {tipo.tipo_solicitacao_descricao}
    </option>
  ))}
</select>
        </div>

        <div className="form-group">
      <label htmlFor="procedure">Procedimentos*</label>
      <Select
            closeMenuOnSelect={tipoSolicitacao !== '2'}
            components={animatedComponents}
            isMulti={tipoSolicitacao === '2'}
            options={procedimentosOptions}
            onChange={handleProcedimentosChange}
            value={procedimentosOptions.filter(option => procedimentosSelecionados.includes(option.value))}
            className="basic-multi-select"
            classNamePrefix="select"
          />
    </div>
      </div>
        
        <div className="flex-container">
          <div className="form-group">
            <label htmlFor="date">Data*</label>
            <input
              type="text"
              id="date"
              placeholder="dd/mm/aaaa"
              required
              maxLength="10"
              value={data}
              onChange={handleDataChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Hora*</label>
            <input type="time" id="time" required value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
        </div>
        <div className="form-group text">
  <div className="flex-container-horizontal">
    <div className="form-group obs">
      <label htmlFor="obs">Observações</label>
      <textarea id="obs" rows="4" cols="50" value={observacoes} onChange={(e) => setObservacoes(e.target.value)}></textarea>
    </div>
  </div>
  <div className="form-group button-save">
      <button type="submit" className="save-button">Salvar</button>
    </div>
</div>
      </form>
    </div>
  );
}

export default ClinicalRequest;