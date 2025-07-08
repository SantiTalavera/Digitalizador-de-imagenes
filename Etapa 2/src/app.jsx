// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import "../style.css";
import logo from "../logo.png";
import { sampleAndQuantize } from "./imageProcessor";

export default function App() {
  const [file, setFile] = useState(null);
  const [resolution, setResolution] = useState(500);
  const [bitDepth, setBitDepth] = useState(8);
  const [compression, setCompression] = useState(0.8);
  const origRef = useRef(null);
  const transRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = origRef.current;
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      sampleAndQuantize(c, transRef.current, resolution, bitDepth);
    };
    img.src = URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (file) {
      sampleAndQuantize(origRef.current, transRef.current, resolution, bitDepth);
    }
  }, [resolution, bitDepth]);

  const handleDownload = () => {
    const url = transRef.current.toDataURL("image/jpeg", compression);
    const a = document.createElement("a");
    a.href = url;
    a.download = "digitalizada.jpg";
    a.click();
  };

  return (
    <div className="container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1>Digitalizador de Imágenes</h1>
      </header>

      <div className="main">
        <div className="top-section">
          <div className="preview-area">
            <label className="upload-area">
              Cargar Imagen ⬆️
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <div className="sliders">
            <div className="slider-group">
              <label>
                Resolución: <strong>{resolution}×{resolution}</strong>
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={resolution}
                onChange={(e) => setResolution(+e.target.value)}
              />
            </div>
            <div className="slider-group">
              <label>
                Profundidad de bits: <strong>{bitDepth}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={bitDepth}
                onChange={(e) => setBitDepth(+e.target.value)}
              />
            </div>
            <div className="slider-group">
              <label>
                Compresión: <strong>{Math.round(compression * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={compression}
                onChange={(e) => setCompression(+e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="canvas-section">
          <div className="canvas-container">
            <canvas ref={origRef}></canvas>
            <p>Original</p>
          </div>
          <div className="canvas-container">
            <canvas ref={transRef}></canvas>
            <p>Transformada</p>
          </div>
        </div>

        <button className="download-button" onClick={handleDownload}>
          Descargar Imagen
        </button>
      </div>

      <footer className="app-footer">
        Integrantes: Pérez Nicolás, Egüen Agustina, Smith Justina, Talavera Santiago
      </footer>
    </div>
);
}
