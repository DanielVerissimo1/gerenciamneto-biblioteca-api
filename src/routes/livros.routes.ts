import { Router } from "express";
import { LivrosController } from "../controllers/livros.controller";

const livrosRoutes = Router();
const livrosController = new LivrosController();

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags:
 *       - Livros
 *     parameters:
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtra livros por genero
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
livrosRoutes.get("/", livrosController.index);

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Retorna um livro pelo ID
 *     tags:
 *       - Livros
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
livrosRoutes.get("/:id", livrosController.show);

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro
 *     tags:
 *       - Livros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarLivro'
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
livrosRoutes.post("/", livrosController.create);

/**
 * @swagger
 * /livros/{id}:
 *   patch:
 *     summary: Atualiza os dados de um livro
 *     tags:
 *       - Livros
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarLivro'
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
livrosRoutes.patch("/:id", livrosController.update);

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro do acervo
 *     tags:
 *       - Livros
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
livrosRoutes.delete("/:id", livrosController.remove);

export { livrosRoutes };
