import { Knex } from "knex";

export async function up(db: Knex): Promise<void> {
  const exists = await db.schema.hasTable("emprestimos");

  if (exists) {
    return;
  }

  await db.schema.createTable("emprestimos", (table) => {
    table.increments("id").primary();
    table
      .integer("livro_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("livros")
      .onDelete("RESTRICT");
    table.string("nome_aluno").notNullable();
    table.date("data_emprestimo").notNullable();
    table.boolean("devolvido").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}
