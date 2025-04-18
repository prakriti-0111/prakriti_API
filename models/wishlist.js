'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
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
      this.belongsTo(models.stocks, {
        foreignKey: "stock_id",
        as: "stock"
      });

      this.belongsTo(models.sizes, {
        foreignKey: "size_id",
        as: "size"
      });

      this.hasMany(models.wishlist_materials, {
        foreignKey: {
          name: 'wishlist_id',
          allowNull: true
        },
        as: 'wishlistMaterial'
      });
    }
  }
  Wishlist.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    total_weight: DataTypes.DECIMAL(15, 3),
      status: DataTypes.STRING,
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'wishlists',
  });
  return Wishlist;
};