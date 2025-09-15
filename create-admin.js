import 'dotenv/config'; // Sintaxis para 'dotenv'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Conéctate a la base de datos
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1); // Sal del proceso si la conexión falla
  });

// Define el esquema de usuario
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Función para crear un usuario administrador
const createAdminUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log(`Usuario administrador '${email}' creado exitosamente.`);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error.message);
  } finally {
    mongoose.disconnect(); // Desconecta de la base de datos
  }
};

// Parámetros del nuevo usuario
const adminEmail = 'admin@miempresa.com';
const adminPassword = 'SuperPasswordSeguro123';

// Ejecuta la función
createAdminUser(adminEmail, adminPassword);