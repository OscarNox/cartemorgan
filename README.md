# Carte Blanche - Colección Editorial

Este es un proyecto de Next.js diseñado con una estética editorial de lujo, integrado con Firebase y Genkit para el análisis de documentos PDF mediante IA.

## Cómo mover este proyecto a VS Code

Para trabajar en este proyecto localmente en tu computadora, sigue estos pasos:

1. **Descarga el código**: Utiliza la función de exportación o descarga de esta plataforma para obtener todos los archivos en un archivo ZIP.
2. **Abre en VS Code**: Descomprime el archivo y abre la carpeta resultante en Visual Studio Code.
3. **Configura el entorno**:
   - Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
   - Crea un archivo `.env.local` en la raíz (si no se incluyó en la descarga) y añade tus credenciales de Firebase y Google AI.
4. **Instalación y ejecución**:
   - Abre la terminal en VS Code.
   - Instala las dependencias necesarias.
   - Ejecuta el servidor de desarrollo con `npm run dev`.
   - Abre [http://localhost:9002](http://localhost:9002) en tu navegador.

## Estructura del Proyecto

- `src/app`: Rutas y páginas principales (Next.js App Router).
- `src/components`: Componentes de UI elegantes y personalizados.
- `src/ai`: Flujos de inteligencia artificial con Genkit.
- `src/firebase`: Configuración y servicios de Firebase.

## Tecnologías utilizadas

- **Next.js 15**: Framework de React para el frontend.
- **Tailwind CSS**: Estilizado mediante clases utilitarias.
- **ShadCN UI**: Componentes de interfaz de alta calidad.
- **Genkit**: Orquestación de IA generativa.
- **Firebase**: Backend para autenticación y base de datos (preparado para integración).

---
Desarrollado con un enfoque en la elegancia y la funcionalidad.
