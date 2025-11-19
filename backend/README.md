# TaskFlow Backend API

Backend API REST para el sistema de gestión de tareas TaskFlow.

## 🛠️ Stack Tecnológico

- **Node.js** 18+
- **Express** 4.18
- **Firebase Admin SDK** 11.11
- **Firestore** (Base de datos NoSQL)
- **Firebase Authentication** (Gestión de usuarios)

## 📋 Requisitos Previos

1. Node.js 18 o superior
2. npm o yarn
3. Cuenta de Firebase con proyecto creado
4. Service Account Key de Firebase

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Firebase:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-project-id.iam.gserviceaccount.com
```

### 4. Obtener credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** > **Service Accounts**
4. Click en **Generate New Private Key**
5. Copia las credenciales al archivo `.env`

## 🏃 Ejecución

### Modo desarrollo (con nodemon)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "Juan Pérez",
  "role": "gerente" | "empleado"
}
```

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Tareas (`/api/tasks`)

#### Listar tareas
```http
GET /api/tasks
Authorization: Bearer <token>
```
- **Gerente**: Ve todas las tareas
- **Empleado**: Solo ve sus tareas asignadas

#### Obtener tarea por ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Crear tarea (solo gerente)
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título de la tarea",
  "description": "Descripción detallada",
  "priority": "alta" | "media" | "baja",
  "assignedTo": "uid_del_empleado",
  "dueDate": "2024-12-31"
}
```

#### Actualizar tarea completa (solo gerente)
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "priority": "alta",
  "status": "in_progress"
}
```

#### Actualizar solo estado (gerente y empleado)
```http
PATCH /api/tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "todo" | "in_progress" | "done"
}
```

#### Eliminar tarea (solo gerente)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Agregar comentario
```http
POST /api/tasks/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Este es un comentario"
}
```

### Usuarios (`/api/users`) - Solo Gerente

#### Listar todos los usuarios
```http
GET /api/users
Authorization: Bearer <token>
```

#### Listar usuarios por rol
```http
GET /api/users/role/:role
Authorization: Bearer <token>
```

#### Obtener métricas
```http
GET /api/users/metrics/summary
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/users/:uid
Authorization: Bearer <token>
```

## 🔐 Autenticación

La API utiliza **JWT tokens** de Firebase Authentication.

Para autenticarte:
1. Registra un usuario usando `POST /api/auth/register`
2. Autentica en el frontend con Firebase Client SDK
3. Obtén el `idToken` del usuario autenticado
4. Incluye el token en el header: `Authorization: Bearer <token>`

## 📊 Estructura de Datos

### Usuario (Firestore: `users` collection)
```json
{
  "uid": "string",
  "email": "string",
  "name": "string",
  "role": "gerente | empleado",
  "createdAt": "timestamp"
}
```

### Tarea (Firestore: `tasks` collection)
```json
{
  "title": "string",
  "description": "string",
  "priority": "alta | media | baja",
  "status": "todo | in_progress | done",
  "assignedTo": "uid",
  "createdBy": "uid",
  "dueDate": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "comments": [
    {
      "text": "string",
      "userId": "uid",
      "userName": "string",
      "createdAt": "timestamp"
    }
  ]
}
```

## 🧪 Pruebas

### Pruebas con Jest
```bash
npm test
```

### Pruebas manuales con Thunder Client o Postman
1. Importa la colección de Postman (si disponible)
2. Configura la variable `{{baseUrl}}` = `http://localhost:3000`
3. Ejecuta las requests

## 🚀 Despliegue en Railway

### 1. Crear cuenta en Railway
https://railway.app

### 2. Crear nuevo proyecto
- Connect GitHub repository
- Selecciona el repositorio del backend

### 3. Configurar variables de entorno
En Railway dashboard, añade todas las variables del archivo `.env`

### 4. Deploy
Railway desplegará automáticamente en cada push a la rama principal

### 5. Obtener URL
Railway asignará una URL pública: `https://tu-app.railway.app`

## 📝 Notas Importantes

- El backend valida permisos por rol en cada endpoint
- Los tokens JWT expiran según configuración de Firebase
- Firestore tiene límites gratuitos: 50K lecturas/día
- Usa índices compuestos para consultas complejas

## 🐛 Troubleshooting

### Error: "Firebase Admin not initialized"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el service account tenga permisos

### Error: "CORS policy"
- Verifica `FRONTEND_URL` en `.env`
- Asegúrate de que el frontend esté en la URL correcta

### Error: "Invalid token"
- Verifica que el token no haya expirado
- Asegúrate de enviar el header `Authorization: Bearer <token>`

## 📞 Soporte

Para problemas o preguntas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

## 📄 Licencia

MIT
