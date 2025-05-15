import React, { useState, useRef, useEffect } from "react";
import { sampleAndQuantize } from "./imageProcessor.js";

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
      process();
    };
    img.src = URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (file) process();
  }, [resolution, bitDepth, compression]);

  function process() {
    sampleAndQuantize(origRef.current, transRef.current, resolution, bitDepth);
  }

  function download() {
    const url = transRef.current.toDataURL("image/jpeg", compression);
    const a = document.createElement("a");
    a.href = url;
    a.download = "digitalizada.jpg";
    a.click();
  }

  return (
    <div className="container">
      <h1 className="title">Digitalizador de Imágenes</h1>

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
        <div>
          <canvas ref={origRef}></canvas>
          <p>Original</p>
        </div>
        <div>
          <canvas ref={transRef}></canvas>
          <p>Transformada</p>
        </div>
      </div>

      <button className="download-button" onClick={download}>
        Descargar Imagen
      </button>
    </div>
  );
}
