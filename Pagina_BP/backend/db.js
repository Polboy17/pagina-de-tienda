import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tienda_ropa_interior', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',   // Usa 'mysql' aquí en lugar de 'mariadb'
  port: 3306,
  logging: false,
});

export default sequelize;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });
