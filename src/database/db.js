require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");

// 🔹 Detecta si está dentro de Docker (por existencia del socket de Docker)
const isDocker = fs.existsSync("/.dockerenv");

// 🔹 Si está en Docker → usa 'db', si no → usa 'localhost'
const host = isDocker ? "db" : process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: host,
    dialect: "postgres",
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
