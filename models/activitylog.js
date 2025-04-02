'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class activityLog extends Model {
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

      this.belongsTo(models.roles, {
        foreignKey: "role_id",
        as: "role"
      });
    }
  }
  activityLog.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    ip_address: DataTypes.STRING,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
    device_type: DataTypes.STRING,
    os_name: DataTypes.STRING,
    os_version: DataTypes.STRING,
    action: DataTypes.STRING,
    app_version: DataTypes.STRING,
    json_info: {
      type: DataTypes.TEXT,
      get() {
        const data = this.getDataValue('json_info');
        try { 
          return JSON.parse(data);
        } catch(err) { 
          return data;
        }
      },
      set(value) {
        this.setDataValue('json_info', JSON.stringify(value));
      }
    },
    image: DataTypes.TEXT,
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
    modelName: 'activity_logs',
  });
  return activityLog;
};