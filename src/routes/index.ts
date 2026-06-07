import { Router } from "express";
import { emprestimosRoutes } from "./emprestimos.routes";
import { livrosRoutes } from "./livros.routes";

const routes = Router();

routes.get("/", (_request, response) => {
  return response.json({
    mensagem: "API de gerenciamento de biblioteca",
    documentacao: "/api-docs",
  });
});

routes.use("/livros", livrosRoutes);
routes.use("/emprestimos", emprestimosRoutes);

export { routes };
