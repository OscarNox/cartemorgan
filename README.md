# Carte Morgan - Guía de Configuración de Base de Datos

Este proyecto utiliza **Firebase Firestore** para la persistencia de datos en tiempo real. Sigue estos pasos para que tu base de datos funcione "para siempre".

## 1. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nuevo proyecto llamado `Carte Morgan`.
3. En el menú lateral, ve a **Firestore Database** y haz clic en "Crear base de datos".
4. Elige una ubicación cercana y comienza en **Modo de prueba** (esto permite leer/escribir sin reglas complejas al principio).

## 2. Configurar Colecciones
La aplicación creará las colecciones automáticamente al subir el primer archivo, pero puedes crearlas manualmente si prefieres:
- `photos`: Documentos con campo `url` (string) y `createdAt` (timestamp).
- `cards`: Documentos con campos `coverImage` (string), `pdfDataUri` (string) y `createdAt` (timestamp).

## 3. Obtener Credenciales
1. Ve a la rueda dentada (Configuración del proyecto) > Configuración del proyecto.
2. En la sección "Tus apps", añade una nueva **App Web** (icono `</>`).
3. Copia el objeto `firebaseConfig`.

## 4. Configurar Variables de Entorno en VS Code
Crea un archivo `.env.local` en la raíz de tu proyecto y pega tus datos:

```env
# Clave de Inteligencia Artificial (Google AI Studio)
GOOGLE_GENAI_API_KEY=tu_clave_de_gemini

# Credenciales de Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 5. Ejecución
Instala las dependencias y lanza el proyecto:
```bash
npm install
npm run dev
```

Tus recuerdos ahora se guardarán permanentemente en la nube de Google.
