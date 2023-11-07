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
