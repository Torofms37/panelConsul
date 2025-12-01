# 💡 Skeleton Loaders - Tips y Mejores Prácticas

## 🎯 Cuándo Usar Skeleton Loaders

### ✅ SÍ usar skeletons cuando:

- Cargas datos desde una API (>300ms de espera esperada)
- El contenido tiene una estructura predecible
- Quieres mantener el layout estable durante la carga
- La experiencia de usuario es importante
- Hay múltiples elementos cargando simultáneamente

### ❌ NO usar skeletons cuando:

- La carga es instantánea (<100ms)
- El contenido es muy dinámico y cambia constantemente
- No hay suficiente espacio visual
- La estructura del contenido es impredecible
- Estás haciendo una transición rápida entre vistas

## 🎨 Diseño de Skeletons

### Principios de Diseño

1. **Replica la estructura real**

   ```tsx
   // ❌ Malo: No refleja la estructura real
   <Skeleton variant="rectangular" height="500px" />

   // ✅ Bueno: Refleja la estructura de la tabla
   <SkeletonTable rows={8} columns={7} />
   ```

2. **Usa dimensiones similares**

   ```tsx
   // ❌ Malo: Dimensiones muy diferentes
   <Skeleton variant="text" width="20%" />  // El título real es 80%

   // ✅ Bueno: Dimensiones similares al contenido real
   <Skeleton variant="text" width="75%" />  // Similar al título real
   ```

3. **Mantén la jerarquía visual**
   ```tsx
   // ✅ Bueno: Mantiene la jerarquía
   <Skeleton variant="text" width="60%" height="1.5rem" />  // Título
   <Skeleton variant="text" width="90%" />                  // Subtítulo
   <Skeleton variant="text" width="80%" />                  // Contenido
   ```

## 🔧 Implementación Técnica

### Patrón Recomendado

```tsx
import { useState, useEffect } from "react";
import { Skeleton } from "./Skeleton";

export const MiComponente = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getData();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Primero maneja errores
  if (error) {
    return <ErrorMessage error={error} />;
  }

  // 2. Luego muestra skeleton
  if (loading) {
    return (
      <div>
        <Header /> {/* Header siempre visible */}
        <Skeleton variant="text" count={5} />
      </div>
    );
  }

  // 3. Finalmente muestra el contenido
  return (
    <div>
      <Header />
      <Content data={data} />
    </div>
  );
};
```

### Optimización de Performance

```tsx
// ✅ Bueno: Número razonable de skeletons
<div className="grid">
  <SkeletonCard />
  <SkeletonCard />
  <SkeletonCard />
  <SkeletonCard />
</div>

// ❌ Malo: Demasiados skeletons (impacto en performance)
<div className="grid">
  {Array.from({ length: 100 }).map((_, i) => (
    <SkeletonCard key={i} />
  ))}
</div>
```

## 📱 Responsive Design

### Mobile-First Approach

```tsx
// ✅ Bueno: Adapta el número de skeletons según el viewport
const SkeletonList = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const skeletonCount = isMobile ? 3 : 6;

  return (
    <div className="grid">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
```

## ⚡ Performance Tips

### 1. Usa CSS Animations (no JavaScript)

```css
/* ✅ Bueno: Animación CSS */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

### 2. Usa transform y opacity para animaciones

```css
/* ✅ Bueno: transform es más eficiente */
.skeleton::after {
  transform: translateX(-100%);
  animation: skeleton-shimmer 2s infinite;
}

/* ❌ Malo: left/right causan reflow */
.skeleton::after {
  left: -100%;
  animation: skeleton-move 2s infinite;
}
```

### 3. Evita re-renders innecesarios

```tsx
// ✅ Bueno: Componente memoizado
export const SkeletonCard = React.memo(() => {
  return <div className="skeleton-card-wrapper">{/* ... */}</div>;
});
```

## 🎭 Variaciones y Personalización

### Skeletons Personalizados

```tsx
// Skeleton para un perfil de usuario
const UserProfileSkeleton = () => (
  <div className="profile-skeleton">
    <Skeleton variant="circular" width="80px" height="80px" />
    <div style={{ marginLeft: "1rem", flex: 1 }}>
      <Skeleton variant="text" width="60%" height="1.5rem" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

// Skeleton para una tarjeta de producto
const ProductCardSkeleton = () => (
  <div className="product-skeleton">
    <Skeleton variant="rectangular" height="200px" />
    <div style={{ padding: "1rem" }}>
      <Skeleton variant="text" width="70%" height="1.2rem" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="30%" height="1.5rem" />
    </div>
  </div>
);
```

## 🐛 Debugging y Testing

### Simular Estados de Carga

```tsx
// Útil para desarrollo y testing
const SIMULATE_SLOW_NETWORK = process.env.NODE_ENV === "development";

const fetchData = async () => {
  if (SIMULATE_SLOW_NETWORK) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const response = await api.getData();
  return response.data;
};
```

### Testing de Skeletons

```tsx
// Ejemplo con React Testing Library
import { render, screen } from "@testing-library/react";
import { MiComponente } from "./MiComponente";

test("muestra skeleton mientras carga", () => {
  render(<MiComponente />);

  // Verifica que el skeleton esté presente
  const skeletons = screen.getAllByTestId("skeleton");
  expect(skeletons.length).toBeGreaterThan(0);
});

test("oculta skeleton después de cargar", async () => {
  render(<MiComponente />);

  // Espera a que los datos carguen
  await waitFor(() => {
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });
});
```

## 🎨 Temas y Personalización

### Personalizar Colores

```css
/* Tema claro personalizado */
.skeleton {
  background: linear-gradient(
    90deg,
    #e8f4f8 0%,
    #d4e9f2 20%,
    #e8f4f8 40%,
    #e8f4f8 100%
  );
}

/* Tema oscuro personalizado */
@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(
      90deg,
      #1a2332 0%,
      #2a3342 20%,
      #1a2332 40%,
      #1a2332 100%
    );
  }
}
```

### Velocidad de Animación

```css
/* Animación rápida (para contenido que carga rápido) */
.skeleton-fast {
  animation: skeleton-loading 1s ease-in-out infinite;
}

/* Animación lenta (para contenido que tarda más) */
.skeleton-slow {
  animation: skeleton-loading 2.5s ease-in-out infinite;
}
```

## 📊 Métricas y Monitoreo

### Medir Tiempo de Carga

```tsx
const MiComponente = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = performance.now();

    fetchData().then(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Enviar métrica a analytics
      analytics.track("data_load_time", { duration: loadTime });

      setLoading(false);
    });
  }, []);

  // ...
};
```

## 🚀 Casos de Uso Avanzados

### Skeleton Progresivo

```tsx
// Muestra diferentes skeletons según el progreso
const ProgressiveSkeleton = ({ progress }) => {
  if (progress < 30) {
    return <Skeleton variant="text" count={2} />;
  }

  if (progress < 70) {
    return <SkeletonCard />;
  }

  return <SkeletonTable rows={3} columns={4} />;
};
```

### Skeleton con Fade-out

```tsx
const FadeOutSkeleton = ({ loading, children }) => {
  const [show, setShow] = useState(loading);

  useEffect(() => {
    if (!loading) {
      // Espera la animación antes de ocultar
      setTimeout(() => setShow(false), 300);
    }
  }, [loading]);

  if (!show) return children;

  return (
    <div className={loading ? "skeleton-visible" : "skeleton-fade-out"}>
      <Skeleton variant="text" count={5} />
    </div>
  );
};
```

## ✅ Checklist de Implementación

- [ ] El skeleton replica la estructura del contenido real
- [ ] Las dimensiones son similares al contenido final
- [ ] La animación es suave y no distrae
- [ ] Funciona en modo oscuro
- [ ] Es responsive en móviles
- [ ] No hay demasiados skeletons (impacto en performance)
- [ ] Se oculta correctamente cuando los datos cargan
- [ ] Maneja estados de error apropiadamente
- [ ] Está documentado en el código
- [ ] Ha sido testeado en diferentes navegadores

## 🎓 Recursos Adicionales

- [Material Design - Progress Indicators](https://material.io/components/progress-indicators)
- [Ant Design - Skeleton](https://ant.design/components/skeleton)
- [CSS Tricks - Skeleton Screens](https://css-tricks.com/building-skeleton-screens-css-custom-properties/)
- [Web.dev - Skeleton Screens](https://web.dev/skeleton-screens/)

---

**Última actualización**: 2025-12-01
**Versión**: 1.0
