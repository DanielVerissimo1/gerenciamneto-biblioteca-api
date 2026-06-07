import { app } from "./app";
import { runMigrations } from "./data/migrations";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger disponivel em http://localhost:${PORT}/api-docs`);
  });
}

startServer().catch((error) => {
  console.error("Erro ao iniciar o servidor:", error);
  process.exit(1);
});
