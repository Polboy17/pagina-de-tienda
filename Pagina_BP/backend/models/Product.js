import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Category from './Category.js';

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock_quantity: DataTypes.INTEGER,
  image_url: DataTypes.STRING,
  rating: DataTypes.FLOAT,
  sku: DataTypes.STRING,
}, {
  tableName: 'products',
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export default Product;
