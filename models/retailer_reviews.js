'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RetailerReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  RetailerReview.init({
    user_id: DataTypes.INTEGER,
    retailer_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    review: DataTypes.TEXT,
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
    modelName: 'retailer_reviews',
  });
  return RetailerReview;
};