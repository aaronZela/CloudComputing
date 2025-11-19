# TaskFlow - Sistema de Gestión de Tareas para PyMEs

## 📋 Descripción
TaskFlow es un sistema SaaS de gestión de tareas diseñado para pequeñas y medianas empresas. Permite a gerentes crear y asignar tareas a empleados, monitorear progreso en tiempo real mediante un tablero Kanban, y obtener métricas de productividad.

## 🏗️ Arquitectura
- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Hosting**: Vercel (frontend) + Railway (backend)

## 📁 Estructura del Proyecto
```
taskflow-project/
├── frontend/          # Aplicación React
├── backend/           # API REST con Express
├── docs/             # Documento final Word + PDF
└── diagrams/         # Diagramas de arquitectura
```

## 🚀 Características Principales

### Para Gerentes:
- ✅ Crear, editar y eliminar tareas
- ✅ Asignar tareas a empleados
- ✅ Dashboard con métricas en tiempo real
- ✅ Visualizar todas las tareas de la organización
- ✅ Establecer prioridades y fechas límite

### Para Empleados:
- ✅ Visualizar tareas asignadas
- ✅ Actualizar estado de tareas (drag & drop)
- ✅ Agregar comentarios
- ✅ Marcar tareas como completadas
- ✅ Recibir notificaciones

## 🔐 Roles y Permisos
- **Gerente**: Acceso completo al sistema
- **Empleado**: Acceso limitado a sus propias tareas

## 📊 Stack Tecnológico Completo

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Beautiful DnD
- Recharts

### Backend
- Node.js 18+
- Express
- Firebase Admin SDK
- Cors
- Dotenv

## 🛠️ Instalación y Configuración

Ver guías detalladas en:
- `frontend/README.md`
- `backend/README.md`
