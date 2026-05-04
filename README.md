# Carte Morgan - Guía de Configuración de Base de Datos y Almacenamiento

Este proyecto utiliza **Firebase Firestore** para datos en tiempo real y **Firebase Storage** para archivos multimedia, asegurando que tus recuerdos se mantengan "para siempre" en la infraestructura de Google.

## 1. Ubicación de tus Archivos (Google Cloud)
Los archivos NO se guardan en una carpeta de Google Drive tradicional, sino en **Firebase Storage**. Esto es mucho más seguro y rápido para una página web.
- **¿Dónde están mis archivos?**: Accede a [Firebase Console](https://console.firebase.google.com/).
- **Cuenta**: La cuenta de Google que utilizó para crear el proyecto.
- **Sección**: Menú lateral > **Storage**. Allí verás las carpetas `photos/`, `covers/` y `pdfs/`.

## 2. Configurar Colecciones en Firestore
La aplicación gestiona estas colecciones automáticamente:
- `photos`: Referencias a las imágenes en la nube.
- `cards`: Referencias a las portadas y los archivos PDF.

## 3. Configurar Almacenamiento (Storage)
1. En Firebase Console, ve a **Storage**.
2. Haz clic en "Comenzar".
3. En la pestaña **Rules** (Reglas), pega lo siguiente para permitir que tu perfil administre los archivos:

```rules
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.email.lower() == 'aidaluxmorgan@gmail.com' || 
         request.auth.token.email.lower() == 'aidaluxmorgan');
    }
  }
}
```

## 4. Variables de Entorno (.env.local)
Asegúrate de tener configurado tu `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` en tu archivo de entorno para que la subida sea exitosa.

Tus recuerdos están protegidos por la misma tecnología que usa Google para sus propios servicios.
