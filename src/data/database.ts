import path from "path";
import setupKnex, { Knex } from "knex";

const databasePath = path.resolve(__dirname, "../../data/biblioteca.sqlite");

export const knex: Knex = setupKnex({
  client: "sqlite3",
  connection: {
    filename: databasePath,
  },
  useNullAsDefault: true,
});

export type LivroRecord = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  disponivel: number;
  created_at: string;
  updated_at: string;
};

export type EmprestimoRecord = {
  id: number;
  livro_id: number;
  nome_aluno: string;
  data_emprestimo: string;
  devolvido: number;
  created_at: string;
  updated_at: string;
};
