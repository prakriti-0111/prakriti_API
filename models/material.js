'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.categories, {
        foreignKey: "category_id",
        as: "category"
      });

      this.belongsTo(models.units, {
        foreignKey: "unit_id",
        as: "unit"
      });

      this.belongsToMany(models.purities, {
        through: "material_purities",
        foreignKey: 'material_id',
        otherKey: "purity_id",
        as: 'purities'
      });

      this.hasOne(models.material_prices, {
        foreignKey: "material_id",
        as: 'material_price'
      });
    }
  }
  Material.init({
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    unit_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
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
    modelName: 'materials',
  });
  return Material;
};