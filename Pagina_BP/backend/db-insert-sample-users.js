import bcrypt from 'bcrypt';
import sequelize from './db.js';
import User from './models/User.js';

async function insertSampleUsers() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MariaDB');

    // Sample users data
    const users = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@example.com',
        password: 'admin123',
        full_name: 'Admin User',
        role: 'admin',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'user@example.com',
        password: 'user123',
        full_name: 'Normal User',
        role: 'user',
      },
    ];

    for (const userData of users) {
      const password_hash = await bcrypt.hash(userData.password, 10);
      await User.create({
        id: userData.id,
        email: userData.email,
        password_hash,
        full_name: userData.full_name,
        role: userData.role,
      });
      console.log(`Inserted user: ${userData.email}`);
    }

    console.log('Sample users inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample users:', error);
    process.exit(1);
  }
}

insertSampleUsers();
