'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "users"
      });
      this.belongsTo(models.countries, {
        foreignKey: "country_id",
        as: "country"
      });
      this.belongsTo(models.states, {
        foreignKey: "state_id",
        as: "state"
      });
      this.belongsTo(models.districts, {
        foreignKey: "district_id",
        as: "district"
      });
    }
  }
  Address.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    type:  DataTypes.STRING,
    name:  DataTypes.STRING,
    street:  DataTypes.STRING,
    landmark:  DataTypes.STRING,
    city:  DataTypes.STRING,
    //state:  DataTypes.STRING,
    zipcode:  DataTypes.STRING,
    //country:  DataTypes.STRING,
    contact:  DataTypes.STRING,
    lat:  DataTypes.DECIMAL(10,6),
    lng:  DataTypes.DECIMAL(10,6),
    country_id:  DataTypes.INTEGER,
    state_id:  DataTypes.INTEGER,
    district_id:  DataTypes.INTEGER,
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
    modelName: 'addresses',
  });
  return Address;
};