import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fasd7faidfDDDDdsdsdf..aa_a";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado a mongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a mongoDB", err));

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    teacherName: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumno" }],
    totalMoney: { type: String, default: 0 },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

const alumnoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  grouName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  moneyPrivided: { type: Number, required: true },
  group: { type: String, required: true },
});
const Alumno = mongoose.model("Alumno", alumnoSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// server.js - Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // (Si no hay token)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // (Si el token es inválido)
    req.user = user;
    next();
  });
};

// RUTA DE REGISTRO
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor al registrar." });
  }
});

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

    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});

app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Bienvenido, ${req.user.email}!`,
    data: "Esto es información sensible del dashboard.",
  });
});

app.get("/api/groups", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ teacher: userId })
      .populate("students")
      .sort({ createdAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los grupos." });
  }
});

app.post("/api/groups", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const teacherId = req.user.id;
    const teacherName = req.user.name;

    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre del grupo es obligatorio." });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res
        .status(409)
        .json({ message: "Ya existe un grupo con ese nombre." });
    }

    const newGroup = new Group({
      name,
      teacher: teacherId,
      teacherName: teacherName || "Maestro Desconocido",
      students: [],
    });

    await newGroup.save();
    res
      .status(201)
      .json({ message: "Grupo creado exitosamente.", group: newGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el grupo." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
