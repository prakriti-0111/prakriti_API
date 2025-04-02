'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.material_price_purities, {
        foreignKey: {
          name: 'material_price_id',
          allowNull: true
        },
        as: 'materialPricePurities'
      });

      this.belongsTo(models.materials, {
        foreignKey: "material_id",
        as: 'material'
      });
    }
  }
  MaterialPrice.init({
    material_id: DataTypes.INTEGER,
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
    modelName: 'material_prices',
  });
  return MaterialPrice;
};