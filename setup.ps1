# AI Smart Inbox - Automated Setup Script
# This script will set up both backend and frontend

Write-Host "🚀 AI Smart Inbox - Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Setup backend .env if it doesn't exist
if (-Not (Test-Path ".env")) {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit backend/.env and add your MONGODB_URI and OPENAI_API_KEY" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Setup frontend .env if it doesn't exist
if (-Not (Test-Path ".env")) {
    Write-Host "📝 Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend/.env and add:" -ForegroundColor White
Write-Host "   - MONGODB_URI (your MongoDB connection string)" -ForegroundColor Gray
Write-Host "   - OPENAI_API_KEY (your OpenAI API key)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (any random string)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start MongoDB if not already running" -ForegroundColor White
Write-Host ""
Write-Host "3. Start the backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""
