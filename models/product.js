'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.categories, {
        foreignKey: "category_id",
        as: "category"
      });

      this.belongsTo(models.sub_categories, {
        foreignKey: "sub_category_id",
        as: "sub_category"
      });

      this.belongsTo(models.tax_slabs, {
        foreignKey: "tax_rate_id",
        as: "tax"
      });

      this.belongsTo(models.certificates, {
        foreignKey: "certificate_id",
        as: "certificate"
      });

      this.belongsToMany(models.certificates, {
        through: "product_certificates",
        foreignKey: 'product_id',
        otherKey: "certificate_id",
        as: 'certificates'
      });

      this.belongsToMany(models.materials, {
        through: "product_materials",
        foreignKey: 'product_id',
        otherKey: "material_id",
        as: 'materials'
      });

      this.belongsToMany(models.sizes, {
        through: "product_sizes",
        foreignKey: 'product_id',
        otherKey: "size_id",
        as: 'sizes'
      });

      this.hasMany(models.stocks, {
        foreignKey: "product_id",
        as: "stocks"
      });

      this.hasMany(models.product_tags, {
        foreignKey: "product_id",
        as: "tags"
      });
    }
  }
  product.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    tax_rate_id: DataTypes.INTEGER,
    product_code: DataTypes.STRING,
    certificate_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    short_desc: DataTypes.TEXT,
    keywords: DataTypes.TEXT,
    meta_title: DataTypes.STRING,
    licence_no: DataTypes.STRING,
    weight: DataTypes.DECIMAL(15, 3),
    avg_rating: DataTypes.DECIMAL(10, 2),
    status: DataTypes.BOOLEAN,
    is_featured: DataTypes.BOOLEAN,
    certified: DataTypes.BOOLEAN,
    video: DataTypes.STRING,
    main_image: DataTypes.STRING,
    images: {
      type: DataTypes.TEXT,
      get() {
        const data = this.getDataValue('images');
        try { 
          return JSON.parse(data);
        } catch(err) { 
          return data;
        }
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
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
    modelName: 'products',
  });
  return product;
};