'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.belongsTo(models.users, {
        foreignKey: "to_user_id",
        as: "to_user"
      });

      this.belongsTo(models.roles, {
        foreignKey: "to_role_id",
        as: "to_role"
      });
    }
  }
  UserToUser.init({
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.STRING,
    to_role_id: DataTypes.INTEGER,
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
    modelName: 'user_to_users',
  });
  return UserToUser;
};