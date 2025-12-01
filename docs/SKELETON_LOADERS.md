# Sistema de Skeleton Loaders

Este documento describe el sistema de skeleton loaders implementado en la aplicación Panel Consul.

## 📋 Descripción General

Los skeleton loaders son componentes visuales que se muestran mientras se cargan los datos desde el servidor. Proporcionan una mejor experiencia de usuario al:

1. **Indicar que algo está cargando** - Los usuarios saben que la aplicación está trabajando
2. **Reducir la percepción de tiempo de espera** - Las animaciones hacen que la espera se sienta más corta
3. **Mantener el layout estable** - Evita saltos visuales cuando se cargan los datos
4. **Aspecto profesional** - Mejora la percepción de calidad de la aplicación

## 🎨 Componentes Disponibles

### Skeleton Base

Componente principal con diferentes variantes:

```tsx
import { Skeleton } from "./components/Skeleton";

// Texto
<Skeleton variant="text" width="60%" />

// Circular (para avatares, gráficos circulares)
<Skeleton variant="circular" width="150px" height="150px" />

// Rectangular
<Skeleton variant="rectangular" height="200px" />

// Card
<Skeleton variant="card" />

// Fila de tabla
<Skeleton variant="table-row" />
```

### SkeletonCard

Componente preconfigurado para tarjetas:

```tsx
import { SkeletonCard } from "./components/Skeleton";

<SkeletonCard />;
```

### SkeletonTable

Componente para tablas con filas y columnas configurables:

```tsx
import { SkeletonTable } from "./components/Skeleton";

<SkeletonTable rows={8} columns={7} />;
```

### SkeletonGroup

Componente específico para tarjetas de grupos:

```tsx
import { SkeletonGroup } from "./components/Skeleton";

<SkeletonGroup />;
```

## 🔧 Implementación en Componentes

### Ejemplo: Contaduría

```tsx
import { Skeleton, SkeletonTable } from "./Skeleton";

if (loading) {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <span>💰</span>
          Contabilidad
        </h2>
        <p className="section-subtitle">Gestión financiera y contable</p>
      </div>

      <div className="contaduria-container">
        <div className="alumnos-list-section content-card">
          <h3 className="card-title">Estado de Pagos de Alumnos</h3>
          <SkeletonTable rows={8} columns={7} />
        </div>

        <div className="financial-summary-section content-card">
          <h3 className="card-title">Resumen del Mes</h3>
          <div className="summary-item">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" height="2rem" />
          </div>
          {/* Más elementos... */}
        </div>
      </div>
    </div>
  );
}
```

### Ejemplo: Calendario

```tsx
import { SkeletonGroup } from "./Skeleton";

{
  loading && (
    <div className="group-list-container">
      <SkeletonGroup />
      <SkeletonGroup />
      <SkeletonGroup />
      <SkeletonGroup />
    </div>
  );
}
```

### Ejemplo: Cursos

```tsx
import { SkeletonCard, SkeletonTable } from "./Skeleton";

if (loading) {
  return (
    <div className="w-full">
      {/* Header... */}

      {!showDetails ? (
        <div className="groups-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="group-details-view">
          <SkeletonTable rows={6} columns={5} />
        </div>
      )}
    </div>
  );
}
```

### Ejemplo: Novedades

```tsx
import { SkeletonCard } from "./Skeleton";

if (loading) {
  return (
    <div>
      {/* Header... */}

      <div className="normal-container">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
```

## 🎭 Animaciones

El sistema incluye dos tipos de animaciones:

1. **skeleton-loading**: Gradiente que se mueve de izquierda a derecha
2. **skeleton-shimmer**: Efecto de brillo que pasa sobre el skeleton

Estas animaciones se ejecutan de forma infinita y están optimizadas para rendimiento.

## 🌓 Soporte de Modo Oscuro

Los skeletons se adaptan automáticamente al modo oscuro del sistema:

```css
@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(
      90deg,
      #2a2a2a 0%,
      #353535 20%,
      #2a2a2a 40%,
      #2a2a2a 100%
    );
  }
}
```

## 📱 Responsive

Los skeletons son completamente responsive y se adaptan a diferentes tamaños de pantalla:

```css
@media (max-width: 768px) {
  .skeleton-card-content {
    padding: 1rem;
  }

  .skeleton-card-wrapper,
  .skeleton-table,
  .skeleton-group-card {
    border-radius: 12px;
  }
}
```

## ✨ Características Adicionales

- **Hover effects**: Los skeleton cards tienen efectos hover sutiles
- **Transiciones suaves**: Todas las animaciones usan `ease-in-out`
- **Accesibilidad**: Los skeletons mantienen la estructura semántica del contenido
- **Rendimiento**: Animaciones optimizadas con `transform` y `opacity`

## 🔄 Estados de Carga

Cada componente principal implementa su propio estado de carga:

- **Contaduría**: Muestra skeleton para tabla de alumnos y resumen financiero
- **Calendario**: Muestra skeleton para tarjetas de grupos
- **Cursos**: Muestra skeleton para grid de cursos o tabla de detalles
- **Novedades**: Muestra skeleton para tarjetas de noticias (con delay simulado)

## 🎯 Mejores Prácticas

1. **Mantener la estructura**: Los skeletons deben reflejar la estructura del contenido real
2. **Número apropiado**: Mostrar un número razonable de skeletons (3-8 elementos)
3. **Dimensiones similares**: Los skeletons deben tener dimensiones similares al contenido real
4. **No abusar**: Solo usar durante cargas de datos, no para transiciones rápidas

## 📝 Notas de Implementación

- Los skeletons se muestran cuando `loading === true`
- Se ocultan automáticamente cuando los datos están disponibles
- No requieren configuración adicional más allá de importar los componentes
- Son completamente independientes del contenido real

## 🚀 Futuras Mejoras

Posibles mejoras futuras:

- Skeletons personalizados por tipo de contenido
- Animaciones más complejas para estados específicos
- Integración con estados de error
- Skeletons para modales y overlays
