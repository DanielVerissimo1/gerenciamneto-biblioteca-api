import { knex } from "../database";
import { up as createLivros } from "./001_create_livros";
import { up as createEmprestimos } from "./002_create_emprestimos";

export async function runMigrations(): Promise<void> {
  await knex.raw("PRAGMA foreign_keys = ON");
  await createLivros(knex);
  await createEmprestimos(knex);
}
