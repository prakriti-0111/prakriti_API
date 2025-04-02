'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecentlyView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RecentlyView.init({
    user_id: DataTypes.INTEGER,
    cookie_id: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
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
    modelName: 'recently_views',
  });
  return RecentlyView;
};