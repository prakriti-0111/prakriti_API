'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.products, {
        foreignKey: "product_id",
        as: "product"
      });

      this.belongsTo(models.materials, {
        foreignKey: "material_id",
        as: "material"
      });

      this.belongsTo(models.sizes, {
        foreignKey: "size_id",
        as: "size"
      });

      this.hasMany(models.stock_materials, {
        foreignKey: {
          name: 'stock_id',
          allowNull: true
        },
        as: 'stockMaterials'
      });

      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });

      this.belongsTo(models.purities, {
        foreignKey: "purity_id",
        as: "purity"
      });

    }
  }
  Stock.init({
    product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    purchase_id: DataTypes.INTEGER,
    purchase_product_id: DataTypes.INTEGER,
    sale_id: DataTypes.INTEGER,
    return_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    current_image:DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    certificate_no: DataTypes.STRING,
    total_weight: DataTypes.DECIMAL(15, 3),
    type: DataTypes.STRING,
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
    modelName: 'stocks',
  });
  return Stock;
};
