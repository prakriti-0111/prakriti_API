'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialPricePurity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.purities, {
        foreignKey: "purity_id",
        as: 'purity'
      });
    }
  }
  MaterialPricePurity.init({
    material_price_id: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    per_gram_price: DataTypes.DECIMAL(10, 2),
    admin_discount: DataTypes.DECIMAL(10, 2),
    distributor_discount: DataTypes.DECIMAL(10, 2),
    se_discount: DataTypes.DECIMAL(10, 2),
    retailer_max_discount: DataTypes.DECIMAL(10, 2),
    customer_discount: DataTypes.DECIMAL(10, 2),
    increase: DataTypes.DECIMAL(10, 2),
    mrp: DataTypes.DECIMAL(10, 2),
    admin_price: DataTypes.DECIMAL(10, 2),
    distributor_price: DataTypes.DECIMAL(10, 2),
    se_price: DataTypes.DECIMAL(10, 2),
    retailer_max_price: DataTypes.DECIMAL(10, 2),
    customer_price: DataTypes.DECIMAL(10, 2),
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
    modelName: 'material_price_purities',
  });
  return MaterialPricePurity;
};