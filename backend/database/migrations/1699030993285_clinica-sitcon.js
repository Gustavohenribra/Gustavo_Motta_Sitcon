exports.shorthands = undefined;

exports.up = pgm => {
  // Tabela pacientes
  pgm.createTable('pacientes', {
    id: { type: 'serial', primaryKey: true },
    nome: { type: 'text', notNull: true },
    dataNasc: { type: 'date', notNull: true },
    CPF: { type: 'text', unique: true, notNull: true },
    status: { type: 'text', notNull: true }
  });

  // Tabela profissionais
  pgm.createTable('profissional', {
    id: { type: 'serial', primaryKey: true },
    nome: { type: 'text', notNull: true },
    status: { type: 'text', notNull: true }
  });

  // Tabela tipoSolicitacao
  pgm.createTable('tipoSolicitacao', {
    id: { type: 'serial', primaryKey: true },
    descricao: { type: 'text', notNull: true },
    status: { type: 'text', notNull: true }
  });

  // Tabela procedimentos
  pgm.createTable('procedimentos', {
    id: { type: 'serial', primaryKey: true },
    descricao: { type: 'text', notNull: true },
    tipo_id: {
      type: 'integer',
      references: '"tipoSolicitacao"',
      onDelete: 'cascade'
    },
    status: { type: 'text', notNull: true }
  });

  // Tabela profissionalAtende
  pgm.createTable('profissionalAtende', {
    id: { type: 'serial', primaryKey: true },
    procedimento_id: {
      type: 'integer',
      references: '"procedimentos"',
      onDelete: 'cascade'
    },
    profissional_id: {
      type: 'integer',
      references: '"profissionais"',
      onDelete: 'cascade'
    },
    status: { type: 'text', notNull: true },
    observacoes: { type: 'text' }
  });
};

exports.down = pgm => {
  pgm.dropTable('profissionalAtende');
  pgm.dropTable('procedimentos');
  pgm.dropTable('tipoSolicitacao');
  pgm.dropTable('profissionais');
  pgm.dropTable('pacientes');
};