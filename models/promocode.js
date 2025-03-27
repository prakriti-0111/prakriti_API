'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promocode extends Model {
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
  Promocode.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    discount: DataTypes.DECIMAL(15, 2),
    discount_type: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    products: DataTypes.TEXT,
    code: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
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
    modelName: 'promocodes',
  });
  return Promocode;
};