"use client";
import { useEffect, useState } from "react";

export default function ElementosPage() {
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
    // 1. URL Simplificada (quitamos filtros para asegurarnos de que traiga ALGO)
    const url = "https://api-react-taller-production.up.railway.app/api/locals";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos:", data);

        // 2. Usamos 'data.items' porque así lo vimos en tu consola
        if (data && data.items) {
          setLocales(data.items);
        } else {
          setLocales([]);
        }
        
        setCargando(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Buscando las mejores cafeterías en Montevideo...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cafeterías Económicas en el Centro</h1>
      
      {locales.length === 0 ? (
        <p>No se encontraron locales con esos filtros.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {locales.map((local) => (
            <div key={local._id || local.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
              {/* Ajusta estos nombres (nombre, imagen, etc) a lo que veas en el JSON */}
              <h3>{local.name || local.nombre}</h3>
              <p>📍 {local.address || local.direccion}</p>
              <p>⭐ Rating: {local.rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}