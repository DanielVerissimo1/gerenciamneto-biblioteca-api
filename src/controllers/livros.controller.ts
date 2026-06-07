import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { knex, LivroRecord } from "../data/database";
import { AppError } from "../utils/AppError";

class LivrosController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const querySchema = z.object({
        genero: z.string().trim().min(1).optional(),
      });

      const { genero } = querySchema.parse(request.query);
      
      const query = knex<LivroRecord>("livros").select().orderBy("id", "asc");

      if (genero) {
        query.whereRaw("LOWER(genero) = LOWER(?)", [genero]);
      }

      const livros = await query;

      return response.json(livros);
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !Number.isNaN(value) && value > 0, {
          message: "id deve ser um numero positivo.",
        })
        .parse(request.params.id);

      const livro = await knex<LivroRecord>("livros").where({ id }).first();

      if (!livro) {
        throw new AppError("Livro nao encontrado.", 404);
      }

      return response.json(livro);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        titulo: z.string().trim().min(1, "titulo e obrigatorio."),
        autor: z.string().trim().min(1, "autor e obrigatorio."),
        genero: z.string().trim().min(1, "genero e obrigatorio."),
      });

      const { titulo, autor, genero } = bodySchema.parse(request.body);

      const [id] = await knex<LivroRecord>("livros").insert({
        titulo,
        autor,
        genero,
        disponivel: 1,
      });

      const livro = await knex<LivroRecord>("livros").where({ id }).first();

      return response.status(201).json(livro);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !Number.isNaN(value) && value > 0, {
          message: "id deve ser um numero positivo.",
        })
        .parse(request.params.id);

      const bodySchema = z
        .object({
          titulo: z.string().trim().min(1).optional(),
          autor: z.string().trim().min(1).optional(),
          genero: z.string().trim().min(1).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
          message: "Informe pelo menos um campo para atualizar.",
        });

      const dadosAtualizacao = bodySchema.parse(request.body);
      const livro = await knex<LivroRecord>("livros").where({ id }).first();

      if (!livro) {
        throw new AppError("Livro nao encontrado.", 404);
      }

      await knex<LivroRecord>("livros")
        .update({ ...dadosAtualizacao, updated_at: knex.fn.now() })
        .where({ id });

      const livroAtualizado = await knex<LivroRecord>("livros")
        .where({ id })
        .first();

      return response.json(livroAtualizado);
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !Number.isNaN(value) && value > 0, {
          message: "id deve ser um numero positivo.",
        })
        .parse(request.params.id);

      const livro = await knex<LivroRecord>("livros").where({ id }).first();

      if (!livro) {
        throw new AppError("Livro nao encontrado.", 404);
      }

      const emprestimoAtivo = await knex("emprestimos")
        .where({ livro_id: id, devolvido: 0 })
        .first();

      if (emprestimoAtivo) {
        throw new AppError(
          "Nao e possivel remover um livro com emprestimo ativo.",
        );
      }

      await knex<LivroRecord>("livros").delete().where({ id });

      return response.json({ mensagem: "Livro removido com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export { LivrosController };
