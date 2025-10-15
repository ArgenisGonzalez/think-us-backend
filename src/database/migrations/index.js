require("dotenv").config();
const { sequelize } = require("../../models"); // Importar desde models/index.js

(async () => {
  try {
    console.log("🚀 Ejecutando migración inicial...");
    await sequelize.sync({ force: true }); // recrea todo desde cero
    console.log("✅ Migración completada");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en migración:", err.message);
    process.exit(1);
  }
})();
