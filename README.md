# Carte Blanche - Colección Editorial

Este es un proyecto de Next.js diseñado con una estética editorial de lujo, integrado con Firebase y Genkit para el análisis de documentos PDF mediante IA.

## Cómo mover este proyecto a VS Code

Para trabajar en este proyecto localmente en tu computadora, sigue estos pasos:

1. **Descarga el código**: Utiliza la función de exportación o descarga de esta plataforma para obtener todos los archivos en un archivo ZIP.
2. **Abre en VS Code**: Descomprime el archivo y abre la carpeta resultante en Visual Studio Code.
3. **Instala las dependencias**:
   - Abre la terminal en VS Code (`Ctrl + J` o `Cmd + J`).
   - Ejecuta: `npm install`
4. **Configura el entorno**:
   - Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
   - Crea un archivo `.env.local` en la raíz y añade tus credenciales (GEMINI_API_KEY, etc.).
5. **Ejecución**:
   - Ejecuta `npm run dev`.
   - Abre [http://localhost:9002](http://localhost:9002) en tu navegador.

## Cómo subir a Netlify

Para desplegar tu aplicación en Netlify, sigue estos pasos:

1. **Sube tu código a GitHub**:
   - Crea un nuevo repositorio en GitHub.
   - Sigue las instrucciones para subir tus archivos locales:
     ```bash
     git init
     git add .
     git commit -m "Primer commit"
     git branch -M main
     git remote add origin TU_URL_DE_GITHUB
     git push -u origin main
     ```
2. **Conecta con Netlify**:
   - Entra en [Netlify.com](https://www.netlify.com/).
   - Haz clic en **"Add new site"** > **"Import an existing project"**.
   - Conecta tu cuenta de GitHub y selecciona el repositorio.
3. **Configuración de construcción**:
   - Netlify detectará automáticamente que es un proyecto de Next.js.
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. **Variables de Entorno (IMPORTANTE)**:
   - Ve a **"Site settings"** > **"Environment variables"**.
   - Añade todas las variables que tienes en tu archivo `.env` (como `GEMINI_API_KEY` y las de Firebase) para que la IA y la base de datos funcionen en la nube.
5. **Despliegue**:
   - Haz clic en **"Deploy site"**. ¡Listo! Tu sitio estará en vivo en pocos minutos.

---
Desarrollado con un enfoque en la elegancia y la funcionalidad editorial.
