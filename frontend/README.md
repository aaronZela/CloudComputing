# TaskFlow Frontend

Frontend web application para TaskFlow - Sistema de gestión de tareas.

## 🛠️ Stack Tecnológico

- **React** 18.2 - Biblioteca UI
- **Vite** 5.0 - Build tool  
- **Tailwind CSS** 3.3 - Framework CSS
- **React Router DOM** 6.20 - Enrutamiento
- **Firebase** 10.7 - Autenticación y base de datos en tiempo real
- **Axios** 1.6 - Cliente HTTP
- **React Beautiful DnD** 13.1 - Drag and drop para tablero Kanban
- **Recharts** 2.10 - Gráficos para dashboard
- **React Hot Toast** 2.4 - Notificaciones

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Firebase configurada
- Backend de TaskFlow corriendo (o desplegado)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del frontend:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Backend API URL
VITE_API_URL=http://localhost:3000/api
# En producción: VITE_API_URL=https://tu-backend.railway.app/api
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Build para producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── kanban/
│   │   │   ├── KanbanColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── CreateTaskModal.jsx
│   │   ├── dashboard/
│   │   │   ├── MetricsCard.jsx
│   │   │   └── TasksChart.jsx
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Loading.jsx
│   │   └── tasks/
│   │       ├── TaskDetail.jsx
│   │       └── CommentsList.jsx
│   ├── contexts/        # Contexts de React
│   │   └── AuthContext.jsx
│   ├── pages/           # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── KanbanBoard.jsx
│   ├── services/        # Servicios y APIs
│   │   ├── firebase.js
│   │   └── api.js
│   ├── utils/           # Utilidades
│   │   └── formatters.js
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── .env                 # Variables de entorno
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Componentes Principales

### AuthContext

Gestiona el estado global de autenticación:
- Login/Logout
- Estado del usuario actual
- Rol del usuario (gerente/empleado)
- Registro de nuevos usuarios

### Dashboard (Solo Gerente)

Vista principal para gerentes con:
- Métricas generales (tareas totales, completadas, pendientes)
- Gráfico de distribución de tareas
- Lista de tareas próximas a vencer
- Botón para crear nuevas tareas

### KanbanBoard

Tablero Kanban con drag-and-drop:
- Tres columnas: To Do, In Progress, Done
- Arrastra tareas entre columnas para cambiar estado
- Filtrado por empleado (gerente ve todas, empleado solo las suyas)
- Sincronización en tiempo real con Firestore

### TaskCard

Tarjeta de tarea individual:
- Título y descripción
- Prioridad (alta/media/baja) con colores
- Empleado asignado
- Fecha límite
- Botones de acción (editar, eliminar)

## 🔐 Autenticación

La aplicación usa Firebase Authentication:

1. **Login**: Email + Password
2. **Registro**: Email + Password + Nombre + Rol
3. **Token JWT**: Se obtiene automáticamente y se incluye en headers de API

### Rutas Protegidas

```jsx
// Solo usuarios autenticados
<PrivateRoute>
  <KanbanBoard />
</PrivateRoute>

// Solo gerentes
<GerenteRoute>
  <Dashboard />
</GerenteRoute>
```

## 📊 Dashboard de Métricas

El dashboard muestra:

```
┌─────────────────────────────────────────┐
│  Total Tareas    │  Completadas         │
│      50          │       35              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Gráfico de Distribución                │
│  [Gráfico de barras por empleado]       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tareas Próximas a Vencer               │
│  • Tarea 1 - Vence en 2 días            │
│  • Tarea 2 - Vence mañana               │
└─────────────────────────────────────────┘
```

## 🎯 Funcionalidades por Rol

### Gerente:
- ✅ Ver dashboard con métricas
- ✅ Crear tareas
- ✅ Editar tareas
- ✅ Eliminar tareas
- ✅ Ver todas las tareas
- ✅ Asignar tareas a empleados
- ✅ Ver métricas por empleado

### Empleado:
- ✅ Ver sus tareas asignadas
- ✅ Actualizar estado de tareas
- ✅ Agregar comentarios
- ✅ Marcar tareas como completadas
- ✅ Recibir notificaciones

## 🚀 Despliegue en Vercel

### 1. Conectar con GitHub

1. Push tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio

### 2. Configurar variables de entorno

En Vercel Dashboard, añade todas las variables del archivo `.env`:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL
```

### 3. Configurar Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Deploy

Vercel desplegará automáticamente en cada push a main.

## 🎨 Personalización de Estilos

### Tailwind Classes Personalizadas

```css
/* btn-primary */
bg-blue-600 hover:bg-blue-700 text-white

/* btn-secondary */
bg-gray-200 hover:bg-gray-300 text-gray-800

/* input */
w-full px-4 py-2 border rounded-lg focus:ring-2

/* card */
bg-white rounded-lg shadow-md p-6
```

### Colores del Tema

Definidos en `tailwind.config.js`:

```javascript
primary: {
  500: '#3b82f6',  // Azul principal
  600: '#2563eb',  // Azul hover
  700: '#1d4ed8',  // Azul activo
}
```

## 🧪 Testing

### Testing Manual

1. **Login como Gerente**:
   - Email: gerente@test.com
   - Password: test123

2. **Login como Empleado**:
   - Email: empleado@test.com
   - Password: test123

3. **Flujo Completo**:
   - Gerente crea tarea
   - Asigna a empleado
   - Empleado ve tarea en su Kanban
   - Empleado mueve tarea a "In Progress"
   - Gerente ve actualización en tiempo real

## 🐛 Troubleshooting

### "Firebase app not initialized"
- Verifica que todas las variables `VITE_FIREBASE_*` estén en `.env`
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto

### "Network Error" al llamar API
- Verifica que `VITE_API_URL` apunte al backend correcto
- Asegúrate de que el backend esté corriendo
- Verifica configuración de CORS en el backend

### Drag & Drop no funciona
- Asegúrate de tener `react-beautiful-dnd` instalado
- Verifica que el usuario tenga permisos para mover la tarea

### Imágenes o estilos no cargan
- Ejecuta `npm run build` y prueba con `npm run preview`
- Verifica rutas de archivos estáticos

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Desktop** (1024px+): Vista completa con sidebar
- **Tablet** (768px-1023px): Sidebar colapsable
- **Mobile** (< 768px): Vista optimizada, menú hamburguesa

## 🔄 Actualización de Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas
npm update

# Actualizar una específica
npm install react@latest
```

## 📝 Notas de Desarrollo

### Estructura de Estado

La app usa Context API para estado global (autenticación) y useState local para estado de componentes individuales.

### Sincronización en Tiempo Real

Firestore listeners se establecen automáticamente en el tablero Kanban para actualizaciones en tiempo real.

### Optimización de Performance

- React.memo en componentes de lista
- useCallback para funciones en props
- Lazy loading de rutas (si el bundle crece)

## 📞 Soporte

Para problemas o dudas:
- Revisa la consola del navegador para errores
- Verifica logs del backend
- Consulta la documentación de Firebase

## 📄 Licencia

MIT

