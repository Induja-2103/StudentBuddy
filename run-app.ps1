# StudentBuddy Application Launcher
# This script starts both backend and frontend servers

Write-Host "🚀 Starting StudentBuddy Application..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm start"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '💻 Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend API is running at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Test Login Credentials:" -ForegroundColor Magenta
Write-Host "   Email: test@student.com" -ForegroundColor White
Write-Host "   Password: Test123!" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
