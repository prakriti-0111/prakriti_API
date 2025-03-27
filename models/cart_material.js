'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  CartMaterial.init({
    cart_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(15, 3),
    quantity: DataTypes.INTEGER,
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
    modelName: 'cart_materials',
  });
  return CartMaterial;
};