import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fasd7faidfDDDDdsdsdf..aa_a";

// --- SCHEMAS ---

const alumnoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  moneyProvided: { type: Number, default: 0 },
  groupName: { type: String, required: true },
  // 8 sesiones: true = asistió/completó, false = no
  attendance: { type: [Boolean], default: new Array(8).fill(false) },
  activities: { type: [Boolean], default: new Array(8).fill(false) },
});
const Alumno = mongoose.model("Alumno", alumnoSchema);

// Esquema de Usuario (Maestro/Admin)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher"], default: "teacher" },
  photoUrl: { type: String, default: "" },
  birthDate: { type: Date },
});
const User = mongoose.model("User", userSchema);

// Esquema de Curso (Predefinido)
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    certificateTemplateUrl: { type: String, default: "" },
    currentGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true }
);
const Course = mongoose.model("Course", courseSchema);

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Specific user (optional)
    roleTarget: { type: String, enum: ["admin", "teacher"] }, // Target all users of a role
    type: {
      type: String,
      enum: [
        "NEW_USER",
        "NEW_GROUP",
        "WEEKLY_STATS",
        "ATTENDANCE_WARNING",
        "COURSE_START",
        "COURSE_ENDING",
        "GENERAL",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object }, // Extra data (e.g., userId to approve, groupId)
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Who has seen/dismissed this
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);

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
    isApproved: { type: Boolean, default: true }, // Admin approval for new groups
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumno" }],
    // Attendance Tracking: Map student ID to their attendance record
    // We will store this in a separate structure or rely on the Alumno schema if modified,
    // but the user request implies session-based tracking.
    // Let's modify the Alumno schema instead or add a parallel structure here.
    // Given the previous structure used 'students' as references, we should check Alumno schema.
  },
  { timestamps: true }
);
const Group = mongoose.model("Group", groupSchema);

// Helper para crear notificaciones
const createNotification = async (
  type,
  title,
  message,
  data = {},
  roleTarget = null,
  recipient = null
) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      data,
      roleTarget,
      recipient,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// --- HELPERS ---

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

// --- MIDDLEWARE ---

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

// --- DB CONNECTION ---

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a mongoDB Atlas");
    // Inicializar cursos predefinidos
    initializeCourses();
  })
  .catch((err) => console.error("Error al conectar a mongoDB", err));

// --- ROUTES ---

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

    // Notificar a los administradores
    await createNotification(
      "NEW_USER",
      "Nuevo Usuario Registrado",
      `El usuario ${name} (${email}) se ha registrado y espera aprobación.`,
      { userId: newUser._id },
      "admin"
    );

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor al registrar." });
  }
});

// RUTA DE INICIO DE SESIÓN
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// --- RUTAS DE USUARIOS (PERFIL Y PERSONAL) ---

// RUTA PROTEGIDA: OBTENER PERFIL DEL USUARIO ACTUAL
app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// RUTA PROTEGIDA: ACTUALIZAR PERFIL (PROPIO)
app.put(
  "/api/users/profile",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, birthDate } = req.body;
      const updates = {};
      if (name) updates.name = name;
      if (birthDate) updates.birthDate = birthDate;

      if (req.file) {
        const protocol = req.protocol;
        const host = req.get("host");
        updates.photoUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      } else if (req.body.photoUrl) {
        updates.photoUrl = req.body.photoUrl;
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");

      res.json({ message: "Perfil actualizado", user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error al actualizar perfil" });
    }
  }
);

// RUTA PROTEGIDA: ELIMINAR CUENTA (PROPIA)
app.delete("/api/users/me", authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    // Opcional: Eliminar grupos asociados o reasignarlos
    res.json({ message: "Cuenta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cuenta" });
  }
});

// RUTA PROTEGIDA: OBTENER TODOS LOS USUARIOS (PARA PERSONAL)
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Para cada usuario, buscamos qué cursos da (grupos donde es teacher)
    const usersWithCourses = await Promise.all(
      users.map(async (user) => {
        const groups = await Group.find({ teacher: user._id }).select("name");
        return {
          ...user.toObject(),
          courses: groups.map((g) => g.name),
        };
      })
    );

    res.json(usersWithCourses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// RUTA PROTEGIDA (ADMIN): CAMBIAR ROL DE USUARIO
app.put("/api/users/:id/role", authenticateToken, async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);
    if (requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos de administrador" });
    }

    const { role } = req.body;
    if (!["admin", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json({ message: "Rol actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol" });
  }
});

// RUTA PROTEGIDA (ADMIN): ELIMINAR OTRO USUARIO
app.delete("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);
    if (requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos de administrador" });
    }

    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Usa la opción de eliminar tu propia cuenta" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado por administrador" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
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

// RUTA PROTEGIDA (ADMIN): SUBIR PLANTILLA DE CONSTANCIA
app.put(
  "/api/courses/:id/template",
  authenticateToken,
  upload.single("template"),
  async (req, res) => {
    try {
      const requester = await User.findById(req.user.id);
      if (requester.role !== "admin") {
        return res
          .status(403)
          .json({ message: "No tienes permisos de administrador" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No se subió ningún archivo" });
      }

      const protocol = req.protocol;
      const host = req.get("host");
      const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { certificateTemplateUrl: fileUrl },
        { new: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }

      res.json({
        message: "Plantilla actualizada",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error al subir plantilla:", error);
      res.status(500).json({ message: "Error al subir la plantilla" });
    }
  }
);

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

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    if (!course.isAvailable) {
      return res.status(409).json({
        message: `El curso "${course.name}" ya está siendo utilizado por otro grupo.`,
      });
    }

    const existingGroup = await Group.findOne({ name: course.name });
    if (existingGroup) {
      return res.status(409).json({
        message: `Ya existe un grupo para el curso "${course.name}".`,
      });
    }

    const studentsData = students.map((student) => ({
      fullName: student.nombre,
      moneyProvided: student.dineroEntregado,
      groupName: course.name,
    }));

    const createdStudents = await Alumno.insertMany(studentsData);

    const newGroup = new Group({
      name: course.name,
      course: courseId,
      teacher: teacherId,
      teacherName: teacherName,
      fechaInicio,
      fechaTermino,
      courseCost: courseCost || 1000,
      students: createdStudents.map((student) => student._id),
    });

    await newGroup.save();

    course.isAvailable = false;
    course.currentGroup = newGroup._id;
    await course.save();

    const groupWithStudents = await Group.findById(newGroup._id)
      .populate("students")
      .populate("course");

    // Notificar a los administradores
    await createNotification(
      "NEW_GROUP",
      "Nuevo Grupo Creado",
      `El profesor ${teacherName} ha creado el grupo para ${course.name}.`,
      { groupId: newGroup._id },
      "admin"
    );

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

    const groupToDelete = await Group.findById(groupId);

    if (!groupToDelete) {
      return res.status(404).json({ message: "Grupo no encontrado." });
    }

    if (groupToDelete.course) {
      await Course.findByIdAndUpdate(groupToDelete.course, {
        isAvailable: true,
        currentGroup: null,
      });
    }

    await Alumno.deleteMany({ _id: { $in: groupToDelete.students } });

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
      const { nombre, dineroEntregado } = req.body;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado." });
      }

      const newStudent = new Alumno({
        fullName: nombre,
        moneyProvided: dineroEntregado,
        groupName: group.name,
      });
      await newStudent.save();

      group.students.push(newStudent._id);
      await group.save();

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

// RUTA PROTEGIDA: ACTUALIZAR ALUMNO DE UN GRUPO
app.put(
  "/api/groups/:groupId/students/:studentId",
  authenticateToken,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { fullName, moneyProvided } = req.body;

      const updatedStudent = await Alumno.findByIdAndUpdate(
        studentId,
        { fullName, moneyProvided },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Alumno no encontrado." });
      }

      res.status(200).json({
        message: "Alumno actualizado exitosamente.",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error al actualizar alumno:", error);
      res.status(500).json({
        message: "Error interno del servidor al actualizar el alumno.",
      });
    }
  }
);

// RUTA PROTEGIDA: ELIMINAR ALUMNO DE UN GRUPO
app.delete(
  "/api/groups/:groupId/students/:studentId",
  authenticateToken,
  async (req, res) => {
    try {
      const { groupId, studentId } = req.params;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado." });
      }

      group.students = group.students.filter(
        (id) => id.toString() !== studentId
      );
      await group.save();

      await Alumno.findByIdAndDelete(studentId);

      res.status(200).json({ message: "Alumno eliminado exitosamente." });
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
      res
        .status(500)
        .json({ message: "Error interno del servidor al eliminar el alumno." });
    }
  }
);

// RUTA PROTEGIDA: OBTENER TODOS LOS GRUPOS (PARA VISTA DE CURSOS)
app.get("/api/all-groups", authenticateToken, async (req, res) => {
  try {
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

// RUTA PROTEGIDA: OBTENER NOTIFICACIONES
app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Buscar notificaciones dirigidas al usuario o a su rol
    // Y que NO hayan sido leídas/descartadas por este usuario
    const notifications = await Notification.find({
      $and: [
        {
          $or: [
            { recipient: user._id },
            { roleTarget: user.role },
            { roleTarget: "all" },
          ],
        },
        { readBy: { $ne: user._id } },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
});

// RUTA PROTEGIDA (ADMIN): CREAR NOTIFICACIÓN (ENVIAR MENSAJE)
app.post("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);
    if (requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos de administrador" });
    }

    const { title, message, recipient, roleTarget } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Título y mensaje son requeridos" });
    }

    await createNotification(
      "GENERAL",
      title,
      message,
      {},
      roleTarget,
      recipient
    );

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

// RUTA PROTEGIDA: MARCAR NOTIFICACIÓN COMO LEÍDA/DESCARTADA
app.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user.id },
    });
    res.json({ message: "Notificación marcada como leída" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
});

// RUTA PROTEGIDA (ADMIN): APROBAR USUARIO
app.put(
  "/api/notifications/:id/approve-user",
  authenticateToken,
  async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification || notification.type !== "NEW_USER") {
        return res.status(404).json({ message: "Notificación no válida" });
      }

      // Aquí podríamos cambiar un estado 'isVerified' si existiera.
      // Como no existe, asumimos que 'aprobar' simplemente borra la notificación
      // y confirma que el usuario se queda.

      // Borramos la notificación para todos (ya se resolvió)
      await Notification.findByIdAndDelete(req.params.id);

      res.json({ message: "Usuario aprobado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al aprobar usuario" });
    }
  }
);

// RUTA PROTEGIDA (ADMIN): APROBAR GRUPO
app.put(
  "/api/notifications/:id/approve-group",
  authenticateToken,
  async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification || notification.type !== "NEW_GROUP") {
        return res.status(404).json({ message: "Notificación no válida" });
      }

      const groupId = notification.data.groupId;
      await Group.findByIdAndUpdate(groupId, { isApproved: true });

      // Borramos la notificación para todos
      await Notification.findByIdAndDelete(req.params.id);

      res.json({ message: "Grupo aprobado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al aprobar grupo" });
    }
  }
);

// RUTA PROTEGIDA: OBTENER ASISTENCIA DE UN GRUPO
app.get(
  "/api/groups/:groupId/attendance",
  authenticateToken,
  async (req, res) => {
    try {
      console.log("Fetching attendance for group ID:", req.params.groupId);

      const group = await Group.findById(req.params.groupId).populate(
        "students"
      );

      if (!group) {
        console.log("Group not found:", req.params.groupId);
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      console.log("Group found:", group.name);
      console.log("Number of students in group:", group.students?.length || 0);

      // Devolvemos solo la info relevante de los estudiantes
      const attendanceData = group.students.map((student) => ({
        _id: student._id,
        fullName: student.fullName,
        attendance: student.attendance || new Array(8).fill(false),
        activities: student.activities || new Array(8).fill(false),
      }));

      console.log(
        "Returning attendance data for",
        attendanceData.length,
        "students"
      );
      res.json(attendanceData);
    } catch (error) {
      console.error("Error in attendance endpoint:", error);
      res.status(500).json({ message: "Error al obtener asistencia" });
    }
  }
);

// RUTA PROTEGIDA: GUARDAR ASISTENCIA
app.post(
  "/api/groups/:groupId/attendance",
  authenticateToken,
  async (req, res) => {
    try {
      const { attendanceData } = req.body; // Array of { studentId, attendance: [], activities: [] }

      // Validar y guardar
      for (const item of attendanceData) {
        await Alumno.findByIdAndUpdate(item.studentId, {
          attendance: item.attendance,
          activities: item.activities,
        });
      }

      res.json({ message: "Asistencia guardada correctamente" });
    } catch (error) {
      console.error("Error saving attendance:", error);
      res.status(500).json({ message: "Error al guardar asistencia" });
    }
  }
);

// --- 3. Inicio del Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
