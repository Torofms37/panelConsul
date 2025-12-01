import React from "react";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonGroup,
} from "./Skeleton";
import "../../styles/skeleton.css";

/**
 * Componente de demostración para mostrar todos los tipos de skeleton loaders
 * Este componente NO se usa en producción, solo para referencia y testing
 */
export const SkeletonShowcase: React.FC = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Skeleton Loaders Showcase</h1>

      {/* Skeleton Text */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Text Skeletons</h2>
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
          }}
        >
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="70%" />
        </div>
      </section>

      {/* Skeleton Circular */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Circular Skeletons</h2>
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Skeleton variant="circular" width="50px" height="50px" />
          <Skeleton variant="circular" width="80px" height="80px" />
          <Skeleton variant="circular" width="120px" height="120px" />
          <Skeleton variant="circular" width="150px" height="150px" />
        </div>
      </section>

      {/* Skeleton Rectangular */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Rectangular Skeletons</h2>
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
          }}
        >
          <Skeleton variant="rectangular" height="100px" />
          <div style={{ marginTop: "1rem" }}>
            <Skeleton variant="rectangular" height="150px" />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Skeleton variant="rectangular" height="200px" />
          </div>
        </div>
      </section>

      {/* Skeleton Cards */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Card Skeletons</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      {/* Skeleton Table */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table Skeleton</h2>
        <SkeletonTable rows={5} columns={4} />
      </section>

      {/* Skeleton Groups */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Group Card Skeletons</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <SkeletonGroup />
          <SkeletonGroup />
          <SkeletonGroup />
        </div>
      </section>

      {/* Mixed Layout Example */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Mixed Layout Example</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <SkeletonTable rows={6} columns={5} />
          </div>
          <div>
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Skeleton variant="text" width="70%" height="1.5rem" />
              <div style={{ marginTop: "1rem" }}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" height="2rem" />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" height="2rem" />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" height="2rem" />
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Skeleton variant="circular" width="150px" height="150px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Widths */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Custom Width Examples</h2>
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
          }}
        >
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </section>

      {/* Multiple Count */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          Multiple Skeletons (using count prop)
        </h2>
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
          }}
        >
          <Skeleton variant="text" count={5} />
        </div>
      </section>
    </div>
  );
};

export default SkeletonShowcase;
