'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        this.belongsTo(models.countries, {
          foreignKey: "country_id",
          as: "country"
        });
      }
  }
  State.init({
    name: DataTypes.STRING,
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id'
      },
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    },
    deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'states',
  });
  return State;
};