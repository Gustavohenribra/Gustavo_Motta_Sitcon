const express = require('express');
const router = express.Router();
const pool = require('../database/db');

const formatarCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

router.get('/pacientes/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome, "dataNasc", "CPF", status FROM pacientes ORDER BY id');

    const dataFormatada = result.rows.map(patient => {
      const date = patient.dataNasc;
      const formattedDate = ('0' + date.getDate()).slice(-2) + '/' +
                            ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
                            date.getFullYear();
      const formattedCpf = formatarCPF(patient.CPF);

      return {
        ...patient,
        dataNasc: formattedDate,
        CPF: formattedCpf
      };
    });

    res.json(dataFormatada);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/profissionais', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM profissional WHERE status = \'ativo\'');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/tipos-solicitacao', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, descricao FROM "tipoSolicitacao" WHERE status = \'ativo\'');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/procedimentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, descricao, tipo_id FROM procedimentos WHERE status = \'ativo\'');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/profissionais/:profissionalId/procedimentos', async (req, res) => {
  try {
    const { profissionalId } = req.params;
    const result = await pool.query(`
      SELECT p.id, p.descricao, ts.id as tipo_solicitacao_id, ts.descricao as tipo_solicitacao_descricao
      FROM procedimentos p
      JOIN "tipoSolicitacao" ts ON p.tipo_id = ts.id
      JOIN "profissionalAtende" pa ON pa.procedimento_id = p.id
      WHERE pa.profissional_id = $1 AND pa.status = 'ativo' AND ts.status = 'ativo'
    `, [profissionalId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.get('/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, nome, "dataNasc", "CPF", status FROM pacientes WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      const patient = result.rows[0];
      const date = patient.dataNasc;
      const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      const formattedCpf = formatarCPF(patient.CPF);

      const patientData = {
        ...patient,
        dataNasc: formattedDate,
        CPF: formattedCpf
      };

      res.json(patientData);
    } else {
      res.status(404).send('Paciente não encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/solicitacoesClinicas', async (req, res) => {
  const { paciente_id, profissional_id, tipo_solicitacao_id, procedimentos_ids, data, hora, observacoes, status } = req.body;

  try {
    await pool.query('BEGIN');

    // Inserir a solicitação clínica
    const solicitacaoResult = await pool.query(
      'INSERT INTO "solicitacoesClinicas" (paciente_id, profissional_id, tipo_solicitacao_id, data, hora, observacoes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [paciente_id, profissional_id, tipo_solicitacao_id, data, hora, observacoes, status]
    );

    const solicitacaoId = solicitacaoResult.rows[0].id;

    // Associar os procedimentos à nova solicitação clínica
    const procedimentoInserts = procedimentos_ids.map(procedimento_id =>
      pool.query(
        'INSERT INTO "solicitacaoProcedimentos" (solicitacao_id, procedimento_id) VALUES ($1, $2)',
        [solicitacaoId, procedimento_id]
      )
    );

    await Promise.all(procedimentoInserts);

    await pool.query('COMMIT');
    res.status(201).json({ ...solicitacaoResult.rows[0], procedimentos_ids });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.get('/solicitacoesClinicas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.id, 
             pa.nome AS paciente_nome, 
             pr.nome AS profissional_nome, 
             ts.descricao AS tipo_solicitacao_descricao, 
             array_agg(p.descricao) AS procedimentos_descricao,
             sc.data, 
             sc.hora, 
             sc.observacoes
      FROM "solicitacoesClinicas" sc
      JOIN pacientes pa ON sc.paciente_id = pa.id
      JOIN profissional pr ON sc.profissional_id = pr.id
      JOIN "tipoSolicitacao" ts ON sc.tipo_solicitacao_id = ts.id
      JOIN "solicitacaoProcedimentos" sp ON sc.id = sp.solicitacao_id
      JOIN procedimentos p ON sp.procedimento_id = p.id
      GROUP BY sc.id, pa.nome, pr.nome, ts.descricao, sc.data, sc.hora, sc.observacoes
      ORDER BY sc.id
    `);
    const formattedData = result.rows.map(solicitacao => ({
      ...solicitacao,
      data: new Date(solicitacao.data).toLocaleDateString('pt-BR'),
      procedimentos_descricao: solicitacao.procedimentos_descricao.join(', ')
    }));


    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/pacientes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT id, nome, "dataNasc", "CPF", status FROM pacientes ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM pacientes');
    const totalCount = parseInt(countResult.rows[0].count);

    const dataFormatada = result.rows.map(patient => {
      const date = patient.dataNasc;
      const formattedDate = ('0' + date.getDate()).slice(-2) + '/' +
                            ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
                            date.getFullYear();
       const formattedCpf = formatarCPF(patient.CPF);

       return {
         ...patient,
         dataNasc: formattedDate,
         CPF: formattedCpf
       };
     });
 
     res.json({
       data: dataFormatada,
       currentPage: page,
       totalPages: Math.ceil(totalCount / limit),
       totalCount: totalCount
     });
   } catch (err) {
     console.error(err);
     res.status(500).send('Server error');
   }});

module.exports = router;
