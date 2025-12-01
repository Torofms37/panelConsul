# 📚 Sistema de Cursos Predefinidos - Implementación Completada

## 📋 Descripción General

Se ha implementado un sistema completo de cursos predefinidos con disponibilidad única. Cada curso solo puede ser utilizado por un grupo a la vez, garantizando que no haya duplicados.

## 🎯 Cursos Disponibles

Los siguientes cursos están predefinidos en el sistema:

1. **LECTOESCRITURA**
2. **MATEMÁTICAS**
3. **MATEMÁTICAS AVANZADAS**
4. **COMPUTACIÓN**
5. **PROGRAMACIÓN**
6. **CAMPAMENTO DE VERANO**
7. **EDUKART**
8. **INGLÉS**
9. **TEJIDO**
10. **TALLER DE ORTOGRAFÍA**

## 🔧 Cambios en el Backend

### 1. Nuevo Modelo: Course (Curso)

```javascript
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
```

**Campos:**

- `name`: Nombre del curso (único)
- `isAvailable`: Indica si el curso está disponible para ser usado
- `currentGroup`: Referencia al grupo que está usando el curso actualmente

### 2. Modelo Group Actualizado

```javascript
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Ahora es el nombre del curso
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  // ... otros campos
});
```

**Cambios:**

- Añadido campo `course` que referencia al modelo Course
- El campo `name` ahora toma automáticamente el nombre del curso seleccionado

### 3. Nuevos Endpoints

#### GET `/api/courses/available`

- **Descripción**: Obtiene todos los cursos disponibles (isAvailable = true)
- **Autenticación**: Requerida
- **Respuesta**: Array de cursos disponibles

```json
[
  {
    "_id": "...",
    "name": "LECTOESCRITURA",
    "isAvailable": true,
    "currentGroup": null
  }
]
```

#### GET `/api/courses`

- **Descripción**: Obtiene todos los cursos con su estado
- **Autenticación**: Requerida
- **Respuesta**: Array de todos los cursos

### 4. Endpoints Modificados

#### POST `/api/groups` - Crear Grupo

**Cambios:**

- Ahora recibe `courseId` en lugar de `name`
- Valida que el curso exista y esté disponible
- Marca el curso como no disponible al crear el grupo
- Asigna el grupo al curso

**Body:**

```json
{
  "courseId": "64abc...",
  "teacherName": "Prof. Juan",
  "fechaInicio": "2025-01-01",
  "fechaTermino": "2025-06-30",
  "courseCost": 1000,
  "students": [...]
}
```

**Validaciones:**

- ✅ El curso debe existir
- ✅ El curso debe estar disponible
- ✅ No puede haber otro grupo con el mismo curso

#### DELETE `/api/groups/:groupId` - Eliminar Grupo

**Cambios:**

- Libera el curso al eliminar el grupo
- Marca `isAvailable = true`
- Limpia `currentGroup = null`

#### GET `/api/groups` y `/api/all-groups`

**Cambios:**

- Ahora incluyen `.populate("course")` para traer los datos del curso

## 🎨 Cambios en el Frontend

### 1. Componente Calendario Actualizado

#### Nueva Interfaz: Course

```typescript
interface Course {
  _id: string;
  name: string;
  isAvailable: boolean;
}
```

#### Estado Actualizado

```typescript
const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
const [nuevoGrupo, setNuevoGrupo] = useState({
  courseId: "", // Cambió de "name" a "courseId"
  teacherName: "",
  fechaInicio: "",
  fechaTermino: "",
  courseCost: 1000,
  students: [],
});
```

#### Carga de Cursos Disponibles

```typescript
useEffect(() => {
  const fetchAvailableCourses = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/courses/available",
      config
    );
    setAvailableCourses(response.data);
  };

  if (modoCreacion) {
    fetchAvailableCourses();
  }
}, [modoCreacion]);
```

### 2. Formulario de Creación Actualizado

**Antes:**

```tsx
<input
  type="text"
  placeholder="Nombre del Grupo"
  value={nuevoGrupo.name}
  onChange={...}
/>
```

**Ahora:**

```tsx
<select
  value={nuevoGrupo.courseId}
  onChange={(e) => setNuevoGrupo({ ...prev, courseId: e.target.value })}
>
  <option value="">-- Seleccione un curso --</option>
  {availableCourses.map((course) => (
    <option key={course._id} value={course._id}>
      {course.name}
    </option>
  ))}
</select>
```

**Características:**

- ✅ Selector desplegable en lugar de input de texto
- ✅ Solo muestra cursos disponibles
- ✅ Mensaje de advertencia si no hay cursos disponibles
- ✅ Validación obligatoria del curso

## 🔄 Flujo de Trabajo

### Crear un Grupo

1. **Usuario abre el formulario de creación**

   - Se cargan los cursos disponibles desde `/api/courses/available`

2. **Usuario selecciona un curso del dropdown**

   - Solo se muestran cursos con `isAvailable = true`

3. **Usuario completa el formulario y guarda**

   - Se envía `courseId` al backend
   - Backend valida que el curso esté disponible
   - Se crea el grupo con el nombre del curso
   - El curso se marca como no disponible
   - Se asigna el grupo al curso

4. **Resultado**
   - Grupo creado exitosamente
   - Curso ya no aparece en la lista de disponibles
   - Otros usuarios no pueden usar ese curso

### Eliminar un Grupo

1. **Usuario elimina un grupo**

   - Se elimina el grupo y sus alumnos

2. **Sistema libera el curso**

   - `isAvailable = true`
   - `currentGroup = null`

3. **Resultado**
   - El curso vuelve a estar disponible
   - Otros usuarios pueden crear grupos con ese curso

## ✨ Características Implementadas

### Backend

- ✅ Modelo de cursos predefinidos
- ✅ Inicialización automática de cursos al conectar a la DB
- ✅ Validación de disponibilidad de cursos
- ✅ Asignación automática de cursos a grupos
- ✅ Liberación automática de cursos al eliminar grupos
- ✅ Endpoints para obtener cursos disponibles
- ✅ Prevención de duplicados

### Frontend

- ✅ Selector de cursos en lugar de input de texto
- ✅ Carga dinámica de cursos disponibles
- ✅ Mensaje de advertencia cuando no hay cursos disponibles
- ✅ Validación de selección de curso
- ✅ Actualización automática de la lista después de crear/eliminar grupos

## 🛡️ Validaciones Implementadas

### Backend

1. **Curso debe existir**: Verifica que el `courseId` corresponda a un curso válido
2. **Curso debe estar disponible**: Solo permite crear grupos con cursos disponibles
3. **No duplicados**: Previene la creación de múltiples grupos para el mismo curso
4. **Campos requeridos**: Valida que todos los campos obligatorios estén presentes

### Frontend

1. **Selección obligatoria**: El curso es un campo requerido
2. **Solo cursos disponibles**: El selector solo muestra cursos que pueden ser usados
3. **Feedback visual**: Mensaje cuando no hay cursos disponibles

## 📊 Ejemplo de Uso

### Escenario 1: Crear Grupo de Lectoescritura

```
1. Profesor A abre "Crear Nuevo Grupo"
2. Ve en el selector: LECTOESCRITURA, MATEMÁTICAS, INGLÉS, etc.
3. Selecciona "LECTOESCRITURA"
4. Completa fechas y alumnos
5. Guarda el grupo
6. ✅ Grupo "LECTOESCRITURA" creado
```

### Escenario 2: Intentar Usar Curso Ocupado

```
1. Profesor B abre "Crear Nuevo Grupo"
2. NO ve "LECTOESCRITURA" en el selector (ya está en uso)
3. Solo ve cursos disponibles
4. Debe elegir otro curso
```

### Escenario 3: Liberar Curso

```
1. Profesor A elimina el grupo "LECTOESCRITURA"
2. Sistema libera el curso automáticamente
3. Profesor B ahora puede ver "LECTOESCRITURA" en el selector
4. ✅ Curso disponible nuevamente
```

## 🎯 Beneficios

1. **Organización**: Los nombres de los grupos son consistentes
2. **Sin duplicados**: Garantiza que cada curso se use una vez a la vez
3. **Fácil gestión**: Los profesores solo eligen de una lista
4. **Escalable**: Fácil agregar nuevos cursos al array predefinido
5. **Automático**: La disponibilidad se gestiona automáticamente

## 🔮 Futuras Mejoras Posibles

- [ ] Panel de administración para gestionar cursos
- [ ] Permitir múltiples grupos del mismo curso (con horarios diferentes)
- [ ] Historial de cursos utilizados
- [ ] Estadísticas por curso
- [ ] Categorías de cursos
- [ ] Cursos con cupos limitados

## 📝 Notas Técnicas

- Los cursos se inicializan automáticamente al conectar a la base de datos
- Si se agregan nuevos cursos al array, se crearán automáticamente
- La disponibilidad se gestiona a nivel de base de datos
- Las transacciones garantizan consistencia de datos

---

**Implementado por**: Sistema de Cursos Predefinidos v1.0
**Fecha**: 2025-12-01
**Estado**: ✅ Completado y funcionando
