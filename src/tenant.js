const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("./database");

class Tenant extends Model {}
Tenant.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    schema: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
}, { sequelize, modelName: 'Tenant'})

module.exports = { Tenant }