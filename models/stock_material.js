'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.materials, {
        foreignKey: "material_id",
        as: "material"
      });

      this.belongsTo(models.units, {
        foreignKey: "unit_id",
        as: "unit"
      });

      this.belongsTo(models.purities, {
        foreignKey: "purity_id",
        as: "purity"
      });

    }
  }
  StockMaterial.init({
    stock_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(15, 3),
    weight_in_gram: DataTypes.DECIMAL(15, 3),
    quantity: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    unit_id: DataTypes.INTEGER,
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
    modelName: 'stock_materials',
  });
  return StockMaterial;
};