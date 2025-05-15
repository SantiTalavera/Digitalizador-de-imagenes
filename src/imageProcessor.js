/**
 * Toma el canvas original, lo muestrea a `targetRes`×`targetRes`,
 * cuantiza a `bitDepth` bits por canal y lo dibuja escalado de vuelta
 * en el canvas de salida.
 */
export function sampleAndQuantize(origCanvas, outCanvas, targetRes, bitDepth) {
  const ow = origCanvas.width;
  const oh = origCanvas.height;
  // 1) muestreo: dibujar en canvas auxiliar de tamaño targetRes
  const tmp = document.createElement('canvas');
  tmp.width = tmp.height = targetRes;
  const tctx = tmp.getContext('2d');
  tctx.drawImage(origCanvas, 0, 0, targetRes, targetRes);

  // 2) cuantización
  const imgData = tctx.getImageData(0, 0, targetRes, targetRes);
  const data = imgData.data;
  const levels = Math.pow(2, bitDepth);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.floor((data[i + c] / 255) * (levels - 1)) * (255 / (levels - 1));
    }
  }
  tctx.putImageData(imgData, 0, 0);

  // 3) escalar de vuelta al tamaño original sin suavizado
  outCanvas.width = ow;
  outCanvas.height = oh;
  const octx = outCanvas.getContext('2d');
  octx.imageSmoothingEnabled = false;
  octx.drawImage(tmp, 0, 0, ow, oh);
}

// La compresión se aplica al toDataURL de descarga
export function compressImage(/*canvas, quality*/) {
  // queda implícita en el download()
}
