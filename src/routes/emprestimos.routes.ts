import { Router } from "express";
import { EmprestimosController } from "../controllers/emprestimos.controller";

const emprestimosRoutes = Router();
const emprestimosController = new EmprestimosController();

/**
 * @swagger
 * /emprestimos:
 *   post:
 *     summary: Registra um novo emprestimo
 *     tags:
 *       - Emprestimos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarEmprestimo'
 *     responses:
 *       201:
 *         description: Emprestimo registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emprestimo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
emprestimosRoutes.post("/", emprestimosController.create);

/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Lista todos os emprestimos ativos
 *     tags:
 *       - Emprestimos
 *     responses:
 *       200:
 *         description: Lista de emprestimos ativos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emprestimo'
 */
emprestimosRoutes.get("/", emprestimosController.index);

/**
 * @swagger
 * /emprestimos/{id}/devolver:
 *   patch:
 *     summary: Marca um emprestimo como devolvido
 *     tags:
 *       - Emprestimos
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Emprestimo devolvido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emprestimo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
emprestimosRoutes.patch("/:id/devolver", emprestimosController.returnBook);

export { emprestimosRoutes };
