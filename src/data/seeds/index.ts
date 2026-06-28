import { EmprestimoRecord, knex, LivroRecord } from "../database";
import { runMigrations } from "../migrations";

const livros = [
  {
    titulo: "Como Enganar o Diabo",
    autor: "Napoleon Hill",
    genero: "Desenvolvimento pessoal",
  },
  {
    titulo: "Nada Pode Me Ferir",
    autor: "David Goggins",
    genero: "Biografia",
  },
  {
    titulo: "O Homem Mais Rico da Babilônia",
    autor: "George S. Clason",
    genero: "Finanças",
  },
  {
    titulo: "O Cortiço",
    autor: "Aluísio Azevedo",
    genero: "Romance naturalista",
  },
  {
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    genero: "Romance",
  },
];

const emprestimos = [
  { tituloLivro: "Como Enganar o Diabo", nomeAluno: "Dandan" },
  { tituloLivro: "Nada Pode Me Ferir", nomeAluno: "Iris" },
  { tituloLivro: "O Homem Mais Rico da Babilônia", nomeAluno: "Davi" },
  { tituloLivro: "O Cortiço", nomeAluno: "Arthur" },
];

async function seed(): Promise<void> {
  await runMigrations();

  await knex.transaction(async (trx) => {
    for (const livro of livros) {
      const existente = await trx<LivroRecord>("livros")
        .where({ titulo: livro.titulo, autor: livro.autor })
        .first();

      if (!existente) {
        await trx<LivroRecord>("livros").insert({
          ...livro,
          disponivel: 1,
        });
      }
    }

    for (const emprestimo of emprestimos) {
      const livro = await trx<LivroRecord>("livros")
        .where({ titulo: emprestimo.tituloLivro })
        .first();

      if (!livro) {
        throw new Error(`Livro não encontrado no seed: ${emprestimo.tituloLivro}`);
      }

      const existente = await trx<EmprestimoRecord>("emprestimos")
        .where({ livro_id: livro.id, nome_aluno: emprestimo.nomeAluno })
        .first();

      const emprestimoAtivo = await trx<EmprestimoRecord>("emprestimos")
        .where({ livro_id: livro.id, devolvido: 0 })
        .first();

      if (!existente && !emprestimoAtivo) {
        await trx<EmprestimoRecord>("emprestimos").insert({
          livro_id: livro.id,
          nome_aluno: emprestimo.nomeAluno,
          data_emprestimo: new Date().toISOString().split("T")[0],
          devolvido: 0,
        });

        await trx<LivroRecord>("livros")
          .where({ id: livro.id })
          .update({ disponivel: 0, updated_at: trx.fn.now() });
      }
    }
  });

  console.log("Seed concluído com sucesso.");
}

seed()
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await knex.destroy();
  });
