import "dotenv/config"; // Sintaxis para 'dotenv'
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a mongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a mongoDB", err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // El formato es "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // Si no hay token, no autorizado

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no es válido
    req.user = user;
    next(); // Continúa a la siguiente ruta
  });
};

// Crea una ruta de ejemplo protegida
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Bienvenido, ${req.user.email}!`,
    data: "Esto es información sensible del dashboard.",
  });
});

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

const JWT_SECRET = process.env.JWT_SECRET || "fasd7faidfDDDDdsdsdf..aa_a";

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // 1. Crea el payload del token (datos del usuario)
    const payload = { id: user._id, email: user.email };

    // 2. Genera el token con la clave secreta
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // 3. Envía el token al cliente junto con el mensaje de éxito
    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});