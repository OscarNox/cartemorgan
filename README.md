# Carte Blanche - Guía de Configuración Local y Despliegue

Este proyecto es una aplicación de Next.js de alta gama con integración de IA (Genkit) y Firebase. Sigue esta guía para configurarlo en tu entorno local (VS Code) y desplegarlo.

## 1. Requisitos Previos

Antes de empezar, asegúrate de tener instalado:
- **Node.js**: Versión 18.0 o superior ([Descárgalo aquí](https://nodejs.org/)).
- **VS Code**: El editor recomendado.
- **Git**: Para el control de versiones y despliegue.

## 2. Configuración en VS Code

1. **Descarga el Proyecto**: Extrae el archivo ZIP en una carpeta de tu preferencia.
2. **Abre la Carpeta**: En VS Code, ve a `Archivo > Abrir Carpeta` y selecciona la raíz del proyecto.
3. **Instala las Dependencias**:
   Abre la terminal integrada en VS Code (`Ctrl + ñ` o `Cmd + J`) y ejecuta:
   ```bash
   npm install
   ```
   *Este comando instalará automáticamente todas las librerías necesarias: Next.js, Firebase, Genkit, Lucide Icons, Shadcn UI y Tailwind CSS.*

## 3. Variables de Entorno (CRÍTICO)

La Inteligencia Artificial no funcionará sin una API Key. 
1. Crea un archivo llamado `.env.local` en la raíz del proyecto.
2. Añade tu clave de Google AI (Gemini):
   ```env
   GOOGLE_GENAI_API_KEY=tu_clave_aqui
   ```
   *Puedes obtener tu clave gratuita en [Google AI Studio](https://aistudio.google.com/).*

## 4. Comandos de Ejecución

- **Modo Desarrollo**: Para ver los cambios en tiempo real.
  ```bash
  npm run dev
  ```
  Luego abre [http://localhost:9002](http://localhost:9002).

- **Interfaz de Genkit (Opcional)**: Para probar los flujos de IA de forma aislada.
  ```bash
  npm run genkit:dev
  ```

- **Construcción para Producción**:
  ```bash
  npm run build
  ```

## 5. Estructura de Dependencias Principales

El proyecto utiliza las siguientes tecnologías clave:
- `next`: Framework de React.
- `genkit`: Para la lógica de IA y procesamiento de PDFs.
- `@genkit-ai/google-genai`: Plugin para conectar con Gemini.
- `firebase`: Para la base de datos y autenticación (si se activa).
- `lucide-react`: Iconografía elegante.
- `shadcn/ui`: Componentes de interfaz de usuario pre-diseñados.
- `tailwind-merge` & `clsx`: Utilidades para manejo de clases CSS.

## 6. Cómo Subir a Netlify

1. **Crea un Repositorio en GitHub**: Sube tu código allí.
2. **Conecta Netlify**:
   - Ve a [Netlify](https://www.netlify.com/).
   - Selecciona "Add new site" > "Import an existing project".
   - Elige tu repositorio de GitHub.
3. **Configura las Variables en Netlify**:
   - Es vital ir a **Site Settings > Environment Variables**.
   - Añade `GOOGLE_GENAI_API_KEY` con tu clave.
4. **Despliegue**: Netlify usará automáticamente el archivo `netlify.toml` incluido para configurar la ruta de construcción.

---
*Nota: Si encuentras errores de tipos al compilar, puedes usar `npm run build` que ya tiene ignorados los errores de TypeScript para facilitar el despliegue rápido.*
