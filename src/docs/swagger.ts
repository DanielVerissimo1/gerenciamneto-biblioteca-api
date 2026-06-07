import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Biblioteca",
      version: "1.0.0",
      description: "Gerenciamento de Biblioteca com Express, SQLite, Knex e Zod",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Livros",
        description: "Operacoes para gerenciamento do acervo",
      },
      {
        name: "Emprestimos",
        description: "Operacoes para emprestimos e devolucoes",
      },
    ],
    components: {
      parameters: {
        Id: {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
            example: 1,
          },
          description: "Identificador do recurso",
        },
      },
      responses: {
        BadRequest: {
          description: "Dados invalidos",
        },
        NotFound: {
          description: "Recurso nao encontrado",
        },
      },
      schemas: {
        Livro: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            titulo: { type: "string", example: "O Senhor dos Aneis" },
            autor: { type: "string", example: "J.R.R. Tolkien" },
            genero: { type: "string", example: "Fantasia" },
            disponivel: { type: "boolean", example: true },
            createdAt: { type: "string", example: "2026-06-07 00:00:00" },
            updatedAt: { type: "string", example: "2026-06-07 00:00:00" },
          },
        },
        CriarLivro: {
          type: "object",
          required: ["titulo", "autor", "genero"],
          properties: {
            titulo: { type: "string", example: "O Senhor dos Aneis" },
            autor: { type: "string", example: "J.R.R. Tolkien" },
            genero: { type: "string", example: "Fantasia" },
          },
        },
        AtualizarLivro: {
          type: "object",
          properties: {
            titulo: { type: "string", example: "O Hobbit" },
            autor: { type: "string", example: "J.R.R. Tolkien" },
            genero: { type: "string", example: "Fantasia" },
          },
        },
        Emprestimo: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            livroId: { type: "integer", example: 1 },
            nomeAluno: { type: "string", example: "Maria Silva" },
            dataEmprestimo: { type: "string", example: "2026-06-07" },
            devolvido: { type: "boolean", example: false },
            createdAt: { type: "string", example: "2026-06-07 00:00:00" },
            updatedAt: { type: "string", example: "2026-06-07 00:00:00" },
          },
        },
        CriarEmprestimo: {
          type: "object",
          required: ["livroId", "nomeAluno"],
          properties: {
            livroId: { type: "integer", example: 1 },
            nomeAluno: { type: "string", example: "Maria Silva" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
});
