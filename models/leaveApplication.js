'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leaveApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  leaveApplication.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    from_date: DataTypes.DATEONLY,
    to_date: DataTypes.DATEONLY,
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
    modelName: 'leave_applications',
  });
  return leaveApplication;
};