exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('pacientes', {
    id: { type: 'serial', primaryKey: true },
    nome: { type: 'text', notNull: true },
    dataNasc: { type: 'date', notNull: true },
    CPF: { type: 'text', unique: true, notNull: true },
    status: { type: 'text', notNull: true }
  });

  pgm.createTable('profissional', {
    id: { type: 'serial', primaryKey: true },
    nome: { type: 'text', notNull: true },
    status: { type: 'text', notNull: true }
  });

  pgm.createTable('tipoSolicitacao', {
    id: { type: 'serial', primaryKey: true },
    descricao: { type: 'text', notNull: true },
    status: { type: 'text', notNull: true }
  });

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

  pgm.createTable('profissionalAtende', {
    id: { type: 'serial', primaryKey: true },
    procedimento_id: {
      type: 'integer',
      references: '"procedimentos"',
      onDelete: 'cascade'
    },
    profissional_id: {
      type: 'integer',
      references: '"profissional"',
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
  pgm.dropTable('profissional');
  pgm.dropTable('pacientes');
};