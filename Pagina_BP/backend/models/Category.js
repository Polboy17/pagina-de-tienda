import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

export default Category;
