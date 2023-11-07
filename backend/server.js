const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pacientesRouter = require('./routes/patients');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', pacientesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
