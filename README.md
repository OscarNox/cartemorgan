
# Carte Blanche - Guía de Configuración y Despliegue

Este proyecto es una aplicación de Next.js con IA (Genkit) y base de datos (Firebase Firestore).

## 1. ¿Cómo funciona?
- **IA de Análisis**: Usa **Genkit** con **Gemini 2.5 Flash** para resumir PDFs.
- **Base de Datos**: Usa **Firebase Firestore** para guardar fotos y cartas permanentemente.
- **Coste $0**: Puedes desplegar esto gratis en Netlify con un subdominio gratuito.

## 2. Configuración en VS Code (Local)
1. Descarga el ZIP y ábrelo en VS Code.
2. Instala las librerías:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz y añade tus llaves:
   ```env
   GOOGLE_GENAI_API_KEY=tu_clave_gemini
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

## 3. Despliegue GRATIS (Netlify)
No necesitas comprar un dominio. Sigue estos pasos:
1. Sube tu carpeta a un repositorio de **GitHub**.
2. Entra en [Netlify](https://www.netlify.com/) y dale a "Add new site" > "Import from git".
3. Selecciona tu repositorio.
4. **IMPORTANTE**: Ve a "Site Settings" > "Environment Variables" y añade todas las variables de tu `.env.local`.
5. Netlify te dará una URL como `https://nombre-al azar.netlify.app`. ¡Esa es tu dirección pública!

## 4. Comandos Útiles
- `npm run dev`: Probar en tu computadora (localhost:9002).
- `npm run build`: Preparar la app para subirla a internet.
