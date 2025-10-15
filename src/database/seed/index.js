require("dotenv").config();
const { User, Role } = require("../../models");
const { ROLES } = require("../../constants/roles");

async function seed() {
  try {
    const userCount = await User.count();

    if (userCount > 0) {
      console.log("Ya existen usuarios. Seed cancelado.");
      return;
    }

    await Promise.all(
      Object.keys(ROLES).map(async (roleKey) => {
        const roleName = ROLES[roleKey];

        const role = await Role.create({
          name: roleName,
          description: `Rol de ${roleName}`,
        });

        const user = await User.create({
          firstName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
          lastName: "Demo",
          email: `${roleName}@example.com`,
          password: "Passw0rd123",
          isActive: true,
        });

        await user.addRole(role.id);
      })
    );

    console.log("Seed completado.");
  } catch (error) {
    console.error("Error en seed:", error.message);
    throw error;
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seed };
