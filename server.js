require("dotenv").config();
const http = require("http");
const url = require("url");
const { connectDB, sequelize } = require("./src/database/db");

const PORT = process.env.PORT || 4000;

// Función para leer body
async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        const parsed = data ? JSON.parse(data) : {};
        resolve(parsed);
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

// Rutas
const routes = {
  "/health": {
    GET: async (_req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          db: sequelize.options.dialect,
          ts: new Date(),
        })
      );
    },
  },
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const route = routes[parsedUrl.pathname];
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (route && route[req.method]) {
    try {
      await route[req.method](req, res);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
});

// Inicia conexión y servidor
(async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("🗃️ Tablas sincronizadas con la base de datos");
  server.listen(PORT, () =>
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  );
})();
