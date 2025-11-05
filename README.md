# Documentación del Proyecto

- Proyecto: nextjs-v15-open-next
- Stack principal: Next.js v15 + OpenNext (adapter)
- Objetivo: Desplegar en arquitectura serverless (por ejemplo AWS Lambda) sin depender de Vercel.

## 1. Estructura del proyecto

Carpeta raíz: contiene package.json, next.config.mjs, open-next.config.mjs, etc.

Dentro de la raíz:

./app/, ./pages/, ./public/, etc → tu app de Next.js.

.next/ → carpeta generada por next build.

.open-next/ → carpeta generada por open-next build, lista para despliegue serverless.

## 2. Dependencias y scripts importantes en package.json

Ejemplo relevante extraído de tu proyecto:

```bash
{
  "name": "nextjs-v15-open-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "start-open": "open-next start",
    "deploy": "open-next build"
  },
  "dependencies": {
    "next": "15.5.6",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.6",
    "open-next": "^3.1.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

## Explicación de cada script:

- npm run dev → Inicia el modo desarrollo con Turbopack (--turbopack) para recarga rápida.

- npm run build → Ejecuta el build tradicional de Next.js (sin --turbopack) para generar .next/.

- npm run deploy → Ejecuta open-next build, empaquetando la salida en .open-next/ lista para serverless.

## 3. Archivo de configuración: open-next.config.mjs

```bash
export default {
  outDir: ".open-next",
  default: {
    runtime: "aws-lambda"
  },
  awsLambda: {
    functionName: "next15-open-next",
    memory: 512,
    timeout: 10
  }
};
```

## ¿Qué hacen estas propiedades?

- outDir: Carpeta de salida del build de OpenNext (en tu caso .open-next).

- default.runtime: Define el runtime serverless por defecto (aquí aws-lambda).

- awsLambda: Opciones específicas para AWS Lambda:

- functionName: nombre de la función en AWS Lambda.

- memory: memoria asignada (MB).

- timeout: tiempo máximo de ejecución (segundos).

## Personalizaciones que puedes agregar:

- region: si usas AWS, define la región.

- edge: si decides usar runtime en Edge.

Para otros proveedores (Cloudflare, Netlify) cambiarías runtime y añadirías sus configuraciones.

## 4. Flujo local / desarrollo

1. Desarrollo rápido:

Esto arranca Next.js en modo desarrollo con Turbopack.

```bash
npm run dev
```

2. Preparar para producción/local testing serverless:

```bash
npm run build
npm run deploy
```

— build genera .next/.

— deploy genera .open-next/.

3. Verificar que .open-next/ contenga la estructura esperada:

- assets/ → archivos estáticos.

- server-functions/ o server-function/ → funciones Lambda.

- open-next.output.json u otro manifest.

Posiblemente carpetas como image-optimization-function/, revalidation-function/ dependiendo de tu configuración.

4. Simulación de entorno serverless local (opcional):

Puedes usar herramientas como Serverless Framework + plugin serverless-offline para levantar las funciones localmente. Ejemplo de serverless.yml:

```bash
service: next15-open-next
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  app:
    handler: .open-next/server-functions/index.handler
    events:
      - httpApi: '*'

plugins:
  - serverless-offline
```

Luego:

```bash
npm install -D serverless serverless-offline
npx serverless offline
```

Esto te permite probar localmente como si fuera una Lambda + API Gateway.

5. Despliegue en AWS

Pasos principales para desplegar en AWS:

1. Asegúrate de que .open-next/ esté generada con npm run deploy.

2. En tu archivo de infraestructura (por ejemplo serverless.yml, AWS CDK o Terraform) apunta al handler generado por OpenNext. Ejemplo (Serverless Framework):

```bash
service: next15-open-next
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  app:
    handler: .open-next/server-functions/index.handler
    # Puedes incluir memoria/timeout aquí o usar lo definido en open-next.config.mjs
    memorySize: 512
    timeout: 10
    events:
      - httpApi: '*'

```

3. Ejecuta despliegue:

```bash
npx serverless deploy
```

4. Verifica en la consola de AWS que la función Lambda fue creada, y que API Gateway (HTTP API) esté apuntando correctamente.

5. Prueba tu dominio / ruta pública para confirmar que la app funciona correctamente en producción.
