# EquinosX Labs

Sitio estático en español para publicar las descargas oficiales de EquinosX Labs en GitHub Pages. El diseño incluye cuatro temas, tres estilos de botón y tarjetas que se alimentan desde `downloads.json`.

## Publicar instaladores

1. En GitHub, abre el repositorio y crea una versión desde **Releases → Draft a new release**.
2. Añade el `.exe` o `.apk` como archivo adjunto y publica la versión. No copies instaladores grandes al historial de Git.
3. Copia el enlace de descarga del archivo y actualiza `downloads.json`.
4. En el objeto correspondiente, cambia `version`, `description`, `buttonLabel`, `href` y pon `published` en `true`.
5. Guarda el cambio en la rama `main`. GitHub Actions publicará la página y el nuevo catálogo.

Ejemplo de una descarga publicada:

```json
{
  "platform": "Windows",
  "name": "ChamberOS para PC",
  "version": "1.4.0",
  "description": "Herramientas para administrar el inventario desde tu computadora.",
  "fileType": "EXE",
  "buttonLabel": "Descargar para Windows",
  "href": "https://github.com/USUARIO/REPOSITORIO/releases/download/v1.4.0/ChamberOS-Setup.exe",
  "published": true,
  "visible": true
}
```

Duplica el objeto para agregar versiones o aplicaciones. Usa `visible: false` para ocultar temporalmente una tarjeta sin borrarla. Los enlaces deben ser HTTPS. Los botones y los nombres se editan en el mismo objeto.

## Cambiar la apariencia

Quien visita la página puede elegir **Aurora**, **Blanco y negro**, **Glaciar** u **Órbita**, además de botones sólidos, de cristal o de contorno. La preferencia se guarda en el navegador de esa persona. Para cambiar la apariencia inicial de todas las personas, edita `DEFAULT_THEME` o `DEFAULT_BUTTON_STYLE` al principio de `app.js`.

Para publicar este sitio, habilita GitHub Pages con **Build and deployment → Source: GitHub Actions**. El flujo de `.github/workflows/pages.yml` despliega la carpeta del repositorio cada vez que se actualiza `main`.
