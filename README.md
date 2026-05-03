
# Carte Blanche - Guía de Configuración Local y Despliegue

Este proyecto es una aplicación de Next.js de alta gama con integración de IA (Genkit) y base de datos persistente (Firebase Firestore).

## 1. Funcionamiento Técnico

- **IA de Análisis**: Usa **Genkit** con **Gemini 2.5 Flash** para resumir PDFs en español.
- **Base de Datos**: Integración con **Firebase Firestore** para guardar fotos y cartas permanentemente.
- **Seguridad de Datos**: Los documentos se almacenan como Data URIs (Base64) en Firestore. Nota: Firestore tiene un límite de 1MB por documento. Para PDFs muy grandes, se recomienda integrar Firebase Storage en el futuro.

## 2. Configuración en VS Code

1. **Descarga el Proyecto**: Extrae el archivo ZIP.
2. **Instala las Dependencias**:
   ```bash
   npm install
   ```

## 3. Variables de Entorno (.env.local)

Crea un archivo `.env.local` en la raíz con lo siguiente:

```env
# Google AI
GOOGLE_GENAI_API_KEY=tu_clave_de_gemini

# Firebase Configuration (Obtenlas en console.firebase.google.com)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 4. Comandos de Ejecución

- **Modo Desarrollo**:
  ```bash
  npm run dev
  ```

## 5. Cómo Desplegar en Netlify

1. Sube tu código a GitHub.
2. Conecta el repo en Netlify.
3. Añade TODAS las variables de entorno de arriba en `Site Settings > Environment Variables`.
4. El archivo `netlify.toml` ya está configurado para el despliegue automático.

---
*Nota: Asegúrate de habilitar "Cloud Firestore" en tu consola de Firebase y configurar las reglas de seguridad en "Test Mode" para el desarrollo inicial.*
