'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => { 
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.products, {
        through: "product_sizes",
        foreignKey: 'size_id',
        otherKey: "product_id",
        as: 'product'
      });
      this.hasMany(models.stocks, {
        foreignKey: 'size_id',
        as: 'stocks'
      });

      this.belongsTo(models.categories, {
        foreignKey: "category_id",
        as: "category"
      });

      this.belongsTo(models.sub_categories, {
        foreignKey: "sub_category_id",
        as: "sub_category"
      });
    }
  }
  Size.init({
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
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
    modelName: 'sizes',
  });
  return Size;
};