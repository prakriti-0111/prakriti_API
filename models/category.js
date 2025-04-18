'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.sub_categories, {
        foreignKey: {
          name: 'category_id',
          allowNull: true,
        },
        as: 'subCategories'
      });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    is_material: DataTypes.BOOLEAN,
    is_ceritified: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    front: DataTypes.BOOLEAN,
    banner: DataTypes.STRING,
    Mobile:DataTypes.STRING,
    icon: DataTypes.STRING,
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
    modelName: 'categories',
  });
  return Category;
};