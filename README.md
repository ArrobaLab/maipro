# MaiPro - Plataforma de Servicios de Mantenimiento y Construcción

Una plataforma web "tipo Uber" para servicios de mantenimiento y construcción tanto para el hogar como comerciales.

## 🏗️ Descripción

MaiPro es una plataforma que conecta a clientes con profesionales certificados en servicios de mantenimiento y construcción. Los usuarios pueden buscar, contratar y calificar proveedores de servicios en diversas categorías como plomería, electricidad, carpintería, construcción, remodelación, y más.

## ✨ Características Principales

- **Autenticación de Usuarios**: Sistema de registro y login con JWT
- **Perfiles de Proveedores**: Los profesionales pueden crear perfiles completos con sus especialidades
- **Catálogo de Servicios**: Amplia gama de categorías de servicios
- **Sistema de Reservas**: Los clientes pueden solicitar servicios con detalles específicos
- **Seguimiento en Tiempo Real**: Estado de las reservas (pendiente, aceptado, en progreso, completado)
- **Sistema de Calificaciones**: Los clientes pueden calificar y dejar reseñas
- **Búsqueda de Proveedores**: Filtrar por especialidad, ubicación, calificación
- **Panel de Administración**: Gestión de servicios y usuarios

## 🛠️ Tecnologías

### Backend
- **Node.js** con **Express.js**
- **MongoDB** con **Mongoose** ODM
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **CORS** para manejo de peticiones cross-origin

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/ArrobaLab/maipro.git
cd maipro
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maipro
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

4. Iniciar MongoDB:
```bash
# En sistemas Unix/Linux/Mac
mongod

# O con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Iniciar el servidor:
```bash
# Modo desarrollo (con auto-recarga)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario (requiere autenticación)
- `PUT /api/auth/profile` - Actualizar perfil del usuario (requiere autenticación)

### Proveedores
- `POST /api/providers` - Crear perfil de proveedor (requiere autenticación)
- `GET /api/providers/search` - Buscar proveedores
- `GET /api/providers/me` - Obtener mi perfil de proveedor (requiere autenticación)
- `GET /api/providers/:id` - Obtener proveedor por ID
- `PUT /api/providers` - Actualizar perfil de proveedor (requiere autenticación)

### Servicios
- `GET /api/services/categories` - Obtener categorías de servicios
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Obtener servicio por ID
- `POST /api/services` - Crear servicio (requiere rol admin)
- `PUT /api/services/:id` - Actualizar servicio (requiere rol admin)
- `DELETE /api/services/:id` - Desactivar servicio (requiere rol admin)

### Reservas
- `POST /api/bookings` - Crear nueva reserva (requiere autenticación)
- `GET /api/bookings/my-bookings` - Obtener mis reservas (requiere autenticación)
- `GET /api/bookings/provider-bookings` - Obtener reservas como proveedor (requiere autenticación)
- `GET /api/bookings/:id` - Obtener reserva por ID (requiere autenticación)
- `PUT /api/bookings/:id/status` - Actualizar estado de reserva (requiere autenticación)
- `PUT /api/bookings/:id/cancel` - Cancelar reserva (requiere autenticación)

### Reseñas
- `POST /api/reviews` - Crear reseña (requiere autenticación)
- `GET /api/reviews/provider/:providerId` - Obtener reseñas de un proveedor
- `POST /api/reviews/:id/respond` - Responder a una reseña (requiere autenticación)

## 🎯 Categorías de Servicios

- 🔧 **Plomería** (Plumbing)
- ⚡ **Electricidad** (Electrical)
- 🪚 **Carpintería** (Carpentry)
- 🎨 **Pintura** (Painting)
- 🏠 **Techos** (Roofing)
- ❄️ **Climatización** (HVAC)
- 🏗️ **Construcción** (Construction)
- 🔨 **Remodelación** (Remodeling)
- 🌳 **Jardinería** (Landscaping)
- 🧹 **Limpieza** (Cleaning)
- 🛠️ **Otros** (Other)

## 📊 Estructura del Proyecto

```
maipro/
├── src/
│   ├── config/
│   │   └── database.js         # Configuración de MongoDB
│   ├── controllers/
│   │   ├── authController.js   # Lógica de autenticación
│   │   ├── providerController.js
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js             # Middleware de autenticación
│   ├── models/
│   │   ├── User.js             # Modelo de usuario
│   │   ├── Provider.js         # Modelo de proveedor
│   │   ├── Service.js          # Modelo de servicio
│   │   ├── Booking.js          # Modelo de reserva
│   │   └── Review.js           # Modelo de reseña
│   └── routes/
│       ├── auth.js             # Rutas de autenticación
│       ├── providers.js
│       ├── services.js
│       ├── bookings.js
│       └── reviews.js
├── server.js                    # Punto de entrada del servidor
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Roles de Usuario

1. **Customer (Cliente)**: Puede buscar proveedores, crear reservas y dejar reseñas
2. **Provider (Proveedor)**: Puede gestionar su perfil, aceptar reservas y responder reseñas
3. **Admin (Administrador)**: Puede gestionar servicios, usuarios y todas las operaciones

## 📝 Ejemplos de Uso

### Registrar un Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### Crear una Reserva
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider": "PROVIDER_ID",
    "service": "SERVICE_ID",
    "serviceAddress": {
      "street": "Calle Principal 123",
      "city": "Ciudad",
      "zipCode": "12345"
    },
    "scheduledDate": "2025-11-15T10:00:00Z",
    "description": "Necesito reparar una fuga en el baño"
  }'
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👥 Autores

ArrobaLab

## 🔮 Próximas Características

- [ ] Integración con pasarela de pagos
- [ ] Chat en tiempo real entre clientes y proveedores
- [ ] Notificaciones push
- [ ] Aplicación móvil (iOS y Android)
- [ ] Sistema de geolocalización en tiempo real
- [ ] Panel de analytics para proveedores
- [ ] Programa de verificación de proveedores
- [ ] Sistema de promociones y descuentos

## 📞 Soporte

Para soporte, envía un email a support@maipro.com o abre un issue en GitHub.
