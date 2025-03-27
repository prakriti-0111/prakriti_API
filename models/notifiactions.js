'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifiaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notifiaction.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
    message: DataTypes.STRING,
    params: DataTypes.TEXT,
    is_read: DataTypes.BOOLEAN,
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
    modelName: 'notifiactions',
  });
  return Notifiaction;
};