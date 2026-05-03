# Carte Blanche - Guía de Configuración Local y Despliegue

Este proyecto es una aplicación de Next.js de alta gama con integración de IA (Genkit) y Firebase. Sigue esta guía para configurarlo en tu entorno local (VS Code) y desplegarlo.

## 1. Funcionamiento Técnico (Cómo trabaja la App)

- **IA de Análisis**: La app usa **Genkit** con el modelo **Gemini 2.5 Flash**. Cuando subes un PDF, la IA lo procesa en el servidor y extrae puntos clave.
- **Estado de los Datos**: Actualmente, la app utiliza **Estado Local (React useState)**. 
  - *¿Qué significa?* Que los datos son volátiles. Si recargas la página, las tarjetas nuevas se borrarán.
- **Base de Datos**: El proyecto incluye el SDK de **Firebase**, pero no está conectado a una base de datos activa por defecto para facilitar el prototipado rápido. Para guardar datos permanentemente, deberás configurar **Firestore**.

## 2. Configuración en VS Code

1. **Descarga el Proyecto**: Extrae el archivo ZIP en una carpeta.
2. **Abre la Carpeta**: En VS Code, ve a `Archivo > Abrir Carpeta`.
3. **Instala las Dependencias**:
   Abre la terminal (`Ctrl + ñ`) y ejecuta:
   ```bash
   npm install
   ```

## 3. Variables de Entorno (OBLIGATORIO)

Crea un archivo `.env.local` en la raíz y añade tu clave:
```env
GOOGLE_GENAI_API_KEY=tu_clave_aqui
```
*Obtén tu clave en [Google AI Studio](https://aistudio.google.com/).*

## 4. Comandos de Ejecución

- **Modo Desarrollo**:
  ```bash
  npm run dev
  ```
  Abre [http://localhost:9002](http://localhost:9002).

## 5. Cómo Subir a Netlify

1. **GitHub**: Sube tu código a un repositorio.
2. **Netlify**:
   - Conecta tu repositorio.
   - **IMPORTANTE**: En `Site Settings > Environment Variables`, añade la variable `GOOGLE_GENAI_API_KEY`.
3. **Despliegue**: El archivo `netlify.toml` ya está configurado para que todo funcione automáticamente.

---
*Nota: Esta aplicación es un prototipo editorial de alta fidelidad. Los archivos PDF se procesan como Data URIs para mantener la simplicidad del servidor.*
