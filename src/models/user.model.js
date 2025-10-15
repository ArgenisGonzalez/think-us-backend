const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../db");

class User extends Model {
  async authenticate(password) {
    return bcrypt.compare(password, this.password);
  }

  async updatePassword() {
    if (!this.password || this.password.length < 8)
      throw new Error("Invalid password");
    this.password = await bcrypt.hash(this.password, 10);
  }
}

User.init(
  {
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    isEmailConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [8, 255] },
    },
    authType: {
      type: DataTypes.ENUM("email", "microsoft", "google"),
      allowNull: false,
      defaultValue: "email",
    },
  },
  {
    sequelize,
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        await user.updatePassword();
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) await user.updatePassword();
      },
    },
  }
);

module.exports = User;
