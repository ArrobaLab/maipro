#!/bin/bash

echo "🚀 Starting MaiPro Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your configuration."
else
    echo "✓ .env file already exists"
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB is installed"
else
    echo "⚠️  MongoDB is not installed locally"
    echo "   You can:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo "   3. Use Docker Compose: docker-compose up -d mongodb"
    echo "   4. Use a cloud MongoDB service (MongoDB Atlas)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your configuration"
echo "  2. Make sure MongoDB is running"
echo "  3. Run 'npm start' to start the server"
echo "  4. Visit http://localhost:5000 to access the API"
echo ""
echo "For development with auto-reload, run: npm run dev"
