
# Carte Blanche - Guía de Configuración, Uso y Despliegue

Este proyecto es una aplicación de Next.js diseñada como una antología editorial de lujo, potenciada por IA (Genkit) y almacenamiento en tiempo real (Firebase Firestore).

## 🚀 ¿Cómo funciona?
- **IA de Análisis**: Utiliza **Genkit** con **Gemini 2.5 Flash** para extraer puntos clave de documentos PDF.
- **Base de Datos**: Usa **Firebase Firestore** para guardar fotos y cartas de manera permanente.
- **Diseño**: Interfaz minimalista y elegante basada en **ShadCN UI** y **Tailwind CSS**.

## 💻 Configuración en VS Code (Local)
1. **Descarga**: Exporta el proyecto como un archivo ZIP y ábrelo en VS Code.
2. **Instalación**: Abre la terminal y ejecuta:
   ```bash
   npm install
   ```
3. **Variables de Entorno**: Crea un archivo `.env.local` en la raíz con tus credenciales:
   ```env
   GOOGLE_GENAI_API_KEY=tu_clave_de_google_ai
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. **Ejecutar**:
   ```bash
   npm run dev
   ```

## 🌐 Cómo Publicar (Despliegue)
Para que otros puedan ver tu aplicación en la web, tienes dos opciones principales:

### Opción A: Firebase App Hosting (Recomendado)
Este proyecto ya incluye `apphosting.yaml`. 
1. Sube tu código a un repositorio en **GitHub**.
2. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
3. Selecciona "App Hosting" y conecta tu repositorio de GitHub.
4. Firebase te dará una URL pública automáticamente.

### Opción B: Netlify (Rápido y Gratis)
1. Sube tu carpeta a **GitHub**.
2. Entra en [Netlify](https://www.netlify.com/) y selecciona "Import from git".
3. **IMPORTANTE**: En "Site Settings" > "Environment Variables", añade todas las variables de tu `.env.local`.
4. Netlify generará una URL gratuita tipo `https://tu-nombre.netlify.app`.

## ⚠️ Notas Técnicas
- **Límite de Tamaño**: Firestore tiene un límite de 1MB por documento. Asegúrate de que los archivos PDF que subas no sean extremadamente pesados (idealmente < 800KB).
- **Persistencia**: Gracias a Firebase, todo lo que subas desde cualquier lugar se verá reflejado en tiempo real en todos los dispositivos que abran la página.
