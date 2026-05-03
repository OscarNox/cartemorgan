
# Carte Blanche - Guía de Configuración, Uso y Despliegue

Este proyecto es una aplicación de Next.js diseñada como una antología editorial de lujo, potenciada por IA (Genkit) y almacenamiento en tiempo real (Firebase Firestore).

## 🚀 Características Principales
- **IA de Análisis**: Utiliza **Genkit** con **Gemini 2.5 Flash** para extraer la esencia emocional de tus cartas.
- **Base de Datos Real**: Integración completa con **Firebase Firestore** para persistencia total de fotos y documentos.
- **Responsive Design**: Interfaz optimizada para móviles, tablets y escritorio con resolución retina.
- **Vista Previa Original**: Lector de PDF integrado para revisar tus documentos digitalizados.

## 💻 Configuración para VS Code

### 1. Requisitos Previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
- Una cuenta en [Firebase Console](https://console.firebase.google.com/).
- Una API Key de [Google AI Studio](https://aistudio.google.com/).

### 2. Pasos de Instalación
1. Descarga y abre el proyecto en VS Code.
2. En la terminal, instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales:
   ```env
   # Genkit / AI
   GOOGLE_GENAI_API_KEY=tu_clave_de_gemini

   # Firebase (Cópialas de la configuración de tu App Web en Firebase)
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

### 3. Configurar Firebase Firestore
1. Ve a tu proyecto en la consola de Firebase.
2. Ve a **Firestore Database** y haz clic en "Crear base de datos".
3. Elige la ubicación más cercana y comienza en **Modo de prueba** (para desarrollo) o configura las reglas de seguridad.
4. Crea dos colecciones vacías: `photos` y `cards`.

### 4. Ejecutar el Proyecto
```bash
npm run dev
```

## 🌐 Despliegue en la Web (Netlify)
1. Sube tu código a un repositorio en **GitHub**.
2. Conecta tu repositorio en **Netlify**.
3. **IMPORTANTE**: Ve a "Site Settings" > "Environment Variables" en Netlify y añade todas las variables de tu `.env.local`.
4. Netlify generará una URL gratuita (ej. `nuestra-historia.netlify.app`).

## ⚠️ Notas Técnicas Importantes
- **Límite de Documentos**: Firestore tiene un límite de 1MB por documento. La aplicación tiene una validación integrada para evitar que subas PDFs demasiado pesados (máximo recomendado ~850KB).
- **Sincronización**: Gracias a `onSnapshot`, si abres la app en dos teléfonos distintos, verás cómo se actualizan las fotos al mismo tiempo.
