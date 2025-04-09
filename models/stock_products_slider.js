'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockProductSlider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
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
  StockProductSlider.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.DECIMAL(15, 2),
    final_price: DataTypes.DECIMAL(15, 2),
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    products: DataTypes.TEXT,
    button_txt: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    banner: DataTypes.STRING,
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
    modelName: 'stock_products_slider',
  });
  return StockProductSlider;
};