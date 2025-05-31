import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tienda_ropa_interior', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false,
});

export default sequelize;
