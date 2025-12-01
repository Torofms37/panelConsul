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
  .then(() => {
    console.log("Conectado a mongoDB Atlas");
    // Inicializar cursos predefinidos
    initializeCourses();
  })
  .catch((err) => console.error("Error al conectar a mongoDB", err));

const alumnoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  moneyProvided: { type: Number, default: 0 },
  groupName: { type: String, required: true },
});
const Alumno = mongoose.model("Alumno", alumnoSchema);

// Esquema de Usuario (Maestro)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Esquema de Curso (Predefinido)
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    currentGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true }
);
const Course = mongoose.model("Course", courseSchema);

// Esquema de Grupo (Con referencia a curso)
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Ahora será el nombre del curso
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherName: { type: String, required: true },
    fechaInicio: { type: String, required: true },
    fechaTermino: { type: String, required: true },
    courseCost: { type: Number, default: 1000 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumno" }],
  },
  { timestamps: true }
);
const Group = mongoose.model("Group", groupSchema);

// Función para inicializar los cursos predefinidos
const initializeCourses = async () => {
  const predefinedCourses = [
    "LECTOESCRITURA",
    "MATEMÁTICAS",
    "MATEMÁTICAS AVANZADAS",
    "COMPUTACIÓN",
    "PROGRAMACIÓN",
    "CAMPAMENTO DE VERANO",
    "EDUKART",
    "INGLÉS",
    "TEJIDO",
    "TALLER DE ORTOGRAFÍA",
  ];

  try {
    const existingCourses = await Course.find();

    if (existingCourses.length === 0) {
      const coursesToInsert = predefinedCourses.map((name) => ({
        name,
        isAvailable: true,
      }));
      await Course.insertMany(coursesToInsert);
      console.log("✅ Cursos predefinidos inicializados correctamente");
    } else {
      // Agregar cursos nuevos si no existen
      for (const courseName of predefinedCourses) {
        const exists = await Course.findOne({ name: courseName });
        if (!exists) {
          await Course.create({ name: courseName, isAvailable: true });
          console.log(`✅ Curso "${courseName}" agregado`);
        }
      }
    }
  } catch (error) {
    console.error("Error al inicializar cursos:", error);
  }
};

// --- 2. Middlewares y Rutas ---

// Middleware para verificar el JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Failed:", err.message);
      return res.sendStatus(403); // Prohibido
    }
    req.user = user;
    next();
  });
};

// RUTA DE REGISTRO (Ya corregida)
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
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor al registrar." });
  }
});

// RUTA DE INICIO DE SESIÓN (Incluye 'name' en el payload)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Payload incluye el ID, email y NAME
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

// RUTA PROTEGIDA: OBTENER CURSOS DISPONIBLES
app.get("/api/courses/available", authenticateToken, async (req, res) => {
  try {
    const availableCourses = await Course.find({ isAvailable: true }).sort({
      name: 1,
    });
    res.status(200).json(availableCourses);
  } catch (error) {
    console.error("Error al obtener cursos disponibles:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los cursos disponibles." });
  }
});

// RUTA PROTEGIDA: OBTENER TODOS LOS CURSOS (CON ESTADO)
app.get("/api/courses", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("currentGroup")
      .sort({ name: 1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ message: "Error al obtener los cursos." });
  }
});

// RUTA PROTEGIDA: OBTENER GRUPOS DEL MAESTRO
app.get("/api/groups", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ teacher: userId })
      .populate("students")
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    res.status(500).json({ message: "Error al obtener los grupos." });
  }
});

// RUTA PROTEGIDA: CREAR GRUPO Y ALUMNOS
app.post("/api/groups", authenticateToken, async (req, res) => {
  try {
    const {
      courseId,
      teacherName,
      fechaInicio,
      fechaTermino,
      students,
      courseCost,
    } = req.body;
    const teacherId = req.user.id;

    if (!courseId || !fechaInicio || !fechaTermino || !teacherName) {
      return res
        .status(400)
        .json({ message: "Faltan datos requeridos del grupo." });
    }

    // Verificar que el curso existe y está disponible
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    if (!course.isAvailable) {
      return res.status(409).json({
        message: `El curso "${course.name}" ya está siendo utilizado por otro grupo.`,
      });
    }

    // Verificar que no exista otro grupo con el mismo nombre de curso
    const existingGroup = await Group.findOne({ name: course.name });
    if (existingGroup) {
      return res.status(409).json({
        message: `Ya existe un grupo para el curso "${course.name}".`,
      });
    }

    // 1. Crear a los alumnos
    const studentsData = students.map((student) => ({
      fullName: student.nombre,
      moneyProvided: student.dineroEntregado,
      groupName: course.name,
    }));

    const createdStudents = await Alumno.insertMany(studentsData);

    // 2. Crear el grupo con las referencias
    const newGroup = new Group({
      name: course.name, // El nombre del grupo es el nombre del curso
      course: courseId,
      teacher: teacherId,
      teacherName: teacherName,
      fechaInicio,
      fechaTermino,
      courseCost: courseCost || 1000,
      students: createdStudents.map((student) => student._id),
    });

    await newGroup.save();

    // 3. Marcar el curso como no disponible y asignar el grupo
    course.isAvailable = false;
    course.currentGroup = newGroup._id;
    await course.save();

    // 4. Devolver el grupo completo con los datos de los alumnos y curso
    const groupWithStudents = await Group.findById(newGroup._id)
      .populate("students")
      .populate("course");

    res.status(201).json({
      message: "Grupo creado exitosamente.",
      group: groupWithStudents,
    });
  } catch (error) {
    console.error("Error al crear grupo:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al crear el grupo." });
  }
});

// RUTA PROTEGIDA: ELIMINAR GRUPO
app.delete("/api/groups/:groupId", authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Obtener el grupo a eliminar
    const groupToDelete = await Group.findById(groupId);

    if (!groupToDelete) {
      return res.status(404).json({ message: "Grupo no encontrado." });
    }

    // 2. Liberar el curso (marcarlo como disponible nuevamente)
    if (groupToDelete.course) {
      await Course.findByIdAndUpdate(groupToDelete.course, {
        isAvailable: true,
        currentGroup: null,
      });
    }

    // 3. Eliminar todos los alumnos asociados al grupo
    await Alumno.deleteMany({ _id: { $in: groupToDelete.students } });

    // 4. Eliminar el grupo
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      message: "Grupo eliminado y curso liberado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar grupo:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar el grupo." });
  }
});

// RUTA PROTEGIDA: ACTUALIZAR DETALLES DEL GRUPO
app.put("/api/groups/:groupId", authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    const updates = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, {
      new: true,
      runValidators: true,
    }).populate("students");

    if (!updatedGroup) {
      return res
        .status(404)
        .json({ message: "Grupo no encontrado para actualizar." });
    }

    res.status(200).json({
      message: "Grupo actualizado exitosamente.",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error al actualizar grupo:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar el grupo." });
  }
});

// RUTA PROTEGIDA: AÑADIR ALUMNO A UN GRUPO EXISTENTE
app.post(
  "/api/groups/:groupId/students",
  authenticateToken,
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { nombre, dineroEntregado } = req.body; // Nuevo alumno

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado." });
      }

      // 1. Crear el nuevo alumno
      const newStudent = new Alumno({
        fullName: nombre,
        moneyProvided: dineroEntregado,
        groupName: group.name,
      });
      await newStudent.save();

      // 2. Agregar el ID del alumno al array 'students' del grupo
      group.students.push(newStudent._id);
      await group.save();

      // 3. Devolver el alumno recién creado para actualizar el frontend
      res.status(201).json({
        message: "Alumno añadido al grupo exitosamente.",
        student: newStudent,
      });
    } catch (error) {
      console.error("Error al añadir alumno:", error);
      res
        .status(500)
        .json({ message: "Error interno del servidor al añadir el alumno." });
    }
  }
);

// RUTA PROTEGIDA: OBTENER TODOS LOS GRUPOS (PARA VISTA DE CURSOS)
app.get("/api/all-groups", authenticateToken, async (req, res) => {
  try {
    // Retorna todos los grupos de la base de datos, sin filtrar por maestro
    const groups = await Group.find()
      .populate("students")
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error al obtener todos los grupos:", error);
    res.status(500).json({ message: "Error al obtener los grupos." });
  }
});

// RUTA PROTEGIDA: ACTUALIZAR DINERO ENTREGADO DE UN ALUMNO
app.put(
  "/api/students/:studentId/payment",
  authenticateToken,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { moneyProvided } = req.body;

      if (moneyProvided === undefined || moneyProvided < 0) {
        return res.status(400).json({ message: "Monto inválido." });
      }

      const updatedStudent = await Alumno.findByIdAndUpdate(
        studentId,
        { moneyProvided },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Alumno no encontrado." });
      }

      res.status(200).json({
        message: "Pago actualizado exitosamente.",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error al actualizar pago:", error);
      res.status(500).json({ message: "Error al actualizar el pago." });
    }
  }
);

// --- 3. Inicio del Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
