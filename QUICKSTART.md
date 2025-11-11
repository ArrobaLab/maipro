# Quick Start Guide

Get MaiPro up and running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- MongoDB 4.4+ installed (or use Docker)
- Git

## Option 1: Quick Start (Recommended for Development)

### Step 1: Clone and Install
```bash
git clone https://github.com/ArrobaLab/maipro.git
cd maipro
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env and update JWT_SECRET if needed
```

### Step 3: Start MongoDB with Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Seed Database (Optional but Recommended)
```bash
npm run seed
```

This creates:
- Admin user: `admin@maipro.com` / `password123`
- Customer: `maria@example.com` / `password123`
- Provider 1: `juan@example.com` / `password123`
- Provider 2: `carlos@example.com` / `password123`
- 10 sample services

### Step 5: Start the Server
```bash
npm run dev
```

Server runs at: http://localhost:5000

## Option 2: Docker Compose (Complete Setup)

### Single Command Setup
```bash
git clone https://github.com/ArrobaLab/maipro.git
cd maipro
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- API server on port 5000

### Seed Database
```bash
docker-compose exec api npm run seed
```

## Verify Installation

### Check API Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MaiPro API is running",
  "timestamp": "2025-11-11T20:00:00.000Z"
}
```

### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### Get Service Categories
```bash
curl http://localhost:5000/api/services/categories
```

## Testing with Postman

Import the Postman collection:
1. Open Postman
2. Click Import
3. Select `postman_collection.json`
4. Set environment variable `base_url` to `http://localhost:5000/api`
5. Start testing!

## What's Next?

### Explore the API
- 📖 Read `API.md` for complete API documentation
- 🔒 Check `SECURITY.md` for security features
- 🏗️ See `README.md` for detailed documentation

### Try These Endpoints

**Get All Services**
```bash
curl http://localhost:5000/api/services
```

**Search Providers**
```bash
curl http://localhost:5000/api/providers/search?specialty=plumbing
```

**Login and Get Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }'
```

**Use Token to Get Profile**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### MongoDB Connection Error
**Problem**: Cannot connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is running
docker ps

# Start MongoDB if not running
docker start mongodb

# Or start fresh
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Port Already in Use
**Problem**: Port 5000 is already in use

**Solution**: Change PORT in `.env` file:
```env
PORT=3000
```

### Module Not Found
**Problem**: Missing dependencies

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Start Development Server (Auto-reload)
```bash
npm run dev
```

### Check Code Syntax
```bash
node -c server.js
node -c src/models/*.js
```

### Reset Database
```bash
# In MongoDB container
docker exec -it mongodb mongosh
> use maipro
> db.dropDatabase()
> exit

# Re-seed
npm run seed
```

## Project Structure

```
maipro/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, rate limiting
│   ├── models/          # Database models
│   └── routes/          # API routes
├── server.js            # Entry point
├── seed.js              # Database seeder
└── package.json         # Dependencies
```

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (auto-reload)
npm run seed       # Seed database with sample data
npm test           # Run tests (not implemented yet)
```

## Environment Variables

Key variables in `.env`:

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/maipro # Database URL
JWT_SECRET=your_secret_here                  # JWT signing key
NODE_ENV=development                         # Environment
```

## API Rate Limits

Be aware of rate limits during testing:

- **Auth endpoints**: 5 requests / 15 minutes
- **Create resources**: 20 requests / hour
- **General API**: 100 requests / 15 minutes

If you hit rate limits during development, restart the server.

## Need Help?

- 📧 Email: support@maipro.com
- 📚 Full Documentation: `README.md`
- 🔐 Security Info: `SECURITY.md`
- 📡 API Reference: `API.md`
- 🐛 Report Issues: GitHub Issues

## Success! 🎉

You now have MaiPro running locally. Start building your maintenance and construction services platform!

### Sample Users (after running `npm run seed`)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@maipro.com | password123 | Full access |
| Customer | maria@example.com | password123 | Can book services |
| Provider | juan@example.com | password123 | Plumbing services |
| Provider | carlos@example.com | password123 | Construction services |

Happy coding! 🚀
