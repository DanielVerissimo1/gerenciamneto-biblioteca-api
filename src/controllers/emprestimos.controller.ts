import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { EmprestimoRecord, knex, LivroRecord } from "../data/database";
import { AppError } from "../utils/AppError";

class EmprestimosController {
  async create(request: Request, response: Response, next: NextFunction) {

    try {
      
      const bodySchema = z.object({
        livroId: z.coerce.number().int().positive("livroId e obrigatorio."),
        nomeAluno: z.string().trim().min(1, "nomeAluno e obrigatorio."),
      });

      const { livroId, nomeAluno } = bodySchema.parse(request.body);

      const novoEmprestimo = await knex.transaction(async (trx) => {
        const livro = await trx<LivroRecord>("livros")
          .where({ id: livroId })
          .first();

        if (!livro) {
          throw new AppError("Livro nao encontrado.", 404);
        }

        if (!Boolean(livro.disponivel)) {
          throw new AppError("Este livro nao esta disponivel para emprestimo.");
        }

        const dataEmprestimo = new Date().toISOString().split("T")[0];
        const [id] = await trx<EmprestimoRecord>("emprestimos").insert({
          livro_id: livroId,
          nome_aluno: nomeAluno,
          data_emprestimo: dataEmprestimo,
          devolvido: 0,
        });

        await trx<LivroRecord>("livros")
          .where({ id: livroId })
          .update({ disponivel: 0, updated_at: trx.fn.now() });

        const emprestimo = await trx<EmprestimoRecord>("emprestimos")
          .where({ id })
          .first();

        return emprestimo;
      });

      return response.status(201).json(novoEmprestimo);
    } catch (error) {
      next(error);
    }
  }

  async index(_request: Request, response: Response, next: NextFunction) {
    try {
      const emprestimos = await knex<EmprestimoRecord>("emprestimos")
        .where({ devolvido: 0 })
        .orderBy("id", "asc");

      return response.json(emprestimos);
    } catch (error) {
      next(error);
    }
  }

  async returnBook(request: Request, response: Response, next: NextFunction) {

    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !Number.isNaN(value) && value > 0, {
          message: "id deve ser um numero positivo.",
        })
        .parse(request.params.id);

      const emprestimoDevolvido = await knex.transaction(async (trx) => {
        const emprestimo = await trx<EmprestimoRecord>("emprestimos")
          .where({ id })
          .first();

        if (!emprestimo) {
          throw new AppError("Emprestimo nao encontrado.", 404);
        }

        await trx<EmprestimoRecord>("emprestimos")
          .where({ id })
          .update({ devolvido: 1, updated_at: trx.fn.now() });

        await trx<LivroRecord>("livros")
          .where({ id: emprestimo.livro_id })
          .update({ disponivel: 1, updated_at: trx.fn.now() });

        const emprestimoAtualizado = await trx<EmprestimoRecord>("emprestimos")
          .where({ id })
          .first();

        return emprestimoAtualizado;
      });

      return response.json(emprestimoDevolvido);
    } catch (error) {
      next(error);
    }
  }
}

export { EmprestimosController };
