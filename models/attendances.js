'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
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
  Attendance.init({
    user_id: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING(10)
    },
    address: DataTypes.STRING(200),
    city: {
      type: DataTypes.STRING(50)
    },
    state: {
      type: DataTypes.STRING(50)
    },
    country: {
      type: DataTypes.STRING(50)
    },
    zipcode: {
      type: DataTypes.STRING(10)
    },
    lat: {
      type: DataTypes.STRING
    },
    lng: {
      type: DataTypes.STRING
    },
    late_reason: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING(20)
    },
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
    modelName: 'attendances',
  });
  return Attendance;
};