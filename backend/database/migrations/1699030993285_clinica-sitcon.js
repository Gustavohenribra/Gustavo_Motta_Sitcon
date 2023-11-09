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
    status: { type: 'text', notNull: true }
  });

  pgm.createTable('solicitacoesClinicas', {
    id: { type: 'serial', primaryKey: true },
    paciente_id: {
      type: 'integer',
      references: '"pacientes"',
      notNull: true,
      onDelete: 'cascade'
    },
    profissional_id: {
      type: 'integer',
      references: '"profissional"',
      notNull: true,
      onDelete: 'cascade'
    },
    tipo_solicitacao_id: {
      type: 'integer',
      references: '"tipoSolicitacao"',
      notNull: true,
      onDelete: 'cascade'
    },
    data: { type: 'text', notNull: true },
    hora: { type: 'text', notNull: true },
    observacoes: { type: 'text' },
    status: { type: 'text', notNull: true }
  });

  pgm.createTable('solicitacaoProcedimentos', {
    id: { type: 'serial', primaryKey: true },
    solicitacao_id: {
      type: 'integer',
      references: '"solicitacoesClinicas"',
      notNull: true,
      onDelete: 'cascade'
    },
    procedimento_id: {
      type: 'integer',
      references: '"procedimentos"',
      notNull: true,
      onDelete: 'cascade'
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('profissionalAtende');
  pgm.dropTable('procedimentos');
  pgm.dropTable('tipoSolicitacao');
  pgm.dropTable('profissional');
  pgm.dropTable('pacientes');
  pgm.dropTable('solicitacoesClinicas');
  pgm.dropTable('solicitacaoProcedimentos');
};