import 'dotenv/config'; // Sintaxis para 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a mongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a mongoDB', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: {type: String, required: true},
});

const User = mongoose.model('User', userSchema);

// Proximamente a registrar, solo es iniciar sesión
// app.post('/api/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Encripta la contraseña antes de guardarla
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: 'Usuario registrado exitosamente.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al registrar el usuario.' });
//   }
// });

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Compara la contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});