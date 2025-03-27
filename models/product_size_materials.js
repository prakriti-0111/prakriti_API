'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSizeMaterial extends Model {
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

        this.belongsTo(models.sizes, {
            foreignKey: "size_id",
            as: "size"
        });
    }
  }
  ProductSizeMaterial.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    product_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(15, 3),
    unit_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    purities: DataTypes.STRING,
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
    modelName: 'product_size_materials',
  });
  return ProductSizeMaterial;
};