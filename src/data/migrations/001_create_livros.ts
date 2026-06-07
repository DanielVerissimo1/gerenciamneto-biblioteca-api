import { Knex } from "knex";

export async function up(db: Knex): Promise<void> {
  const exists = await db.schema.hasTable("livros");

  if (exists) {
    return;
  }

  await db.schema.createTable("livros", (table) => {
    table.increments("id").primary();
    table.string("titulo").notNullable();
    table.string("autor").notNullable();
    table.string("genero").notNullable();
    table.boolean("disponivel").notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}
