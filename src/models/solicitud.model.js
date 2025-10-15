const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const Employee = require("./employee.model");

const SOLICITUD_STATUS = {
  PENDIENTE: "pendiente",
  CANCELADA: "cancelada",
  COMPLETADA: "completada",
};

class Solicitud extends Model {}

Solicitud.init(
  {
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        SOLICITUD_STATUS.PENDIENTE,
        SOLICITUD_STATUS.CANCELADA,
        SOLICITUD_STATUS.COMPLETADA
      ),
      defaultValue: SOLICITUD_STATUS.PENDIENTE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "solicitudes",
    timestamps: true,
  }
);

Employee.hasMany(Solicitud, { foreignKey: "employeeId", onDelete: "CASCADE" });
Solicitud.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports = Solicitud;
