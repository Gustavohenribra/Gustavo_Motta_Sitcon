
# Projeto Clínica Sitcon

Este projeto é uma solução de gerenciamento para uma clínica, permitindo a solicitação de exames laboratoriais e consultas de retorno.
Projeto para teste oferecido pela empresa Sitcon, Ipatinga-MG.

## Features

- Listagem de pacientes
- Solicitação clínica
- Listagem de solicitações

## Feature adicional:

- Filtros por data, tipo de procedimento, profissional, Tipo de Solicitação e Paciente.
- Opção para adicionar observações por parte dos profissionais a cada exame ou consulta marcada.

## Tecnologias Utilizadas

- Backend: Node.js
- Frontend: React
- Banco de dados: PostgreSQL

## Configuração do Projeto

Para configurar este projeto em seu ambiente local, siga os passos abaixo:

1. Clone o repositório para sua máquina local.
2. Instale as dependências do projeto com o comando `npm install` dentro da pasta backend.
3. Instale as dependências do projeto com o comando `npm install` dentro da pasta frontend.
4. Configure as variáveis de ambiente criando um arquivo `.env` na pasta ./backend do projeto com os seguintes parâmetros:
   ```
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_HOST=endereço_do_host(Testando localmente seria o "localhost")
   DB_PORT=porta_do_banco(A porta padrao do postgresql é "5432")
   DB_NAME=nome_do_banco
   ```
5. Inicialize o banco de dados com os scripts de migração e de seeding dentro da pasta backend:`npm run migrate` e `npm run seed`.

## Como Usar

Abra um terminal para iniciar o servidor do backend, dentro da pasta backend execute `npm start`.

Para iniciar o servidor do projeto, abra um outro terminal e execute `npm start` dentro da pasta frontend. O servidor estará acessível na porta padrão `3000`.

## Estrutura do Banco de Dados

A estrutura do banco de dados é composta pelas seguintes tabelas:

- `pacientes`: Armazena informações dos pacientes, como nome, data de nascimento, CPF e status (ativo/inativo).
- `profissional`: Contém os dados dos profissionais da saúde, incluindo nome e status.
- `tipoSolicitacao`: Define os tipos de solicitações que podem ser feitas, como consultas ou exames.
- `procedimentos`: Relaciona os procedimentos disponíveis, com descrição e tipo associado.
- `profissionalAtende`: Registra quais profissionais atendem a quais procedimentos.
- `solicitacaoProcedimentos`: Registra os procedimentos e os agrupa por ID, em caso de haver mais de um procedimento por exame, facilitando a organizaçao dos dados.
- `solicitacoesClinicas`: Registra as solicitaçoes clinicas integrando com o solicitacaoProcedimentos.
- `pgmigrations`: Controla as migraçoes das tabelas.

## Autor

Gustavo Motta
