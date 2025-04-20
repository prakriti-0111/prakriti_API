'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HomepageSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  HomepageSetting.init({
    section_name: DataTypes.STRING,
    order: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    }
  }, {
    sequelize,
    paranoid: false,
    modelName: 'homepage_settings',
  });
  return HomepageSetting;
};