import express from 'express';
import cors from 'cors';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from './db.js';
import path from 'path';
import upload from './middleware/upload.js';
import { downloadImage } from './utils/downloadImage.js';

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect to MariaDB
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MariaDB');
  })
  .catch((err) => {
    console.error('MariaDB connection error:', err);
  });

// Sync models (optional, can be removed if DB already has tables)
sequelize.sync();

// API endpoints

// Get all products with category populated
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity, image_url, sku } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      price,
      category_id,
      stock_quantity,
      image_url,
      sku
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product by id
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const { name, description, price, category_id, stock_quantity, image_url, sku } = req.body;
    console.log(`Actualizando producto ${id} con image_url:`, image_url);
    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;
    product.category_id = category_id !== undefined ? category_id : product.category_id;
    product.stock_quantity = stock_quantity !== undefined ? stock_quantity : product.stock_quantity;
    product.image_url = image_url !== undefined ? image_url : product.image_url;
    product.sku = sku !== undefined ? sku : product.sku;
    await product.save();
    console.log(`Producto ${id} actualizado correctamente`);
    res.json(product);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product by id
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile by id
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'full_name', 'role', 'createdAt', 'updatedAt']
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile by id
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, avatar_url, role, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (full_name !== undefined) user.full_name = full_name;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (role !== undefined) user.role = role;
    if (password !== undefined) {
      const password_hash = await bcrypt.hash(password, 10);
      user.password_hash = password_hash;
    }
    await user.save();
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role: role || 'user'
    });
    res.status(201).json({ id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: newUser.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'updatedAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user by id
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const usersCount = await User.count();
    const productsCount = await Product.count();
    const categoriesCount = await Category.count();
    res.json({ users: usersCount, products: productsCount, categories: categoriesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No se subió ningún archivo');
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  console.log('Archivo subido:', req.file.filename);
  const imageUrl = `/uploads/${req.file.filename}`;
  console.log('URL de la imagen:', imageUrl);
  res.json({ url: imageUrl });
});

// New endpoint to download image from URL and save locally
app.post('/api/upload-url', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'No se proporcionó URL de imagen' });
  }
  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const fileName = await downloadImage(imageUrl, uploadDir);
    const localUrl = `/uploads/${fileName}`;
    console.log('Imagen descargada y guardada:', localUrl);
    res.json({ url: localUrl });
  } catch (error) {
    console.error('Error descargando imagen:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
