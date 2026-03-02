#!/bin/bash

# AI Smart Inbox - Automated Setup Script
# This script will set up both backend and frontend

echo "🚀 AI Smart Inbox - Setup Script"
echo "================================="
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION detected"

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Setup backend .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MONGODB_URI and OPENAI_API_KEY"
fi

cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Setup frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Edit backend/.env and add:"
echo "   - MONGODB_URI (your MongoDB connection string)"
echo "   - OPENAI_API_KEY (your OpenAI API key)"
echo "   - JWT_SECRET (any random string)"
echo ""
echo "2. Start MongoDB if not already running"
echo ""
echo "3. Start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For detailed instructions, see QUICKSTART.md"
echo ""
