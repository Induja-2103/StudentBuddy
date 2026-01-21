# StudentBuddy MongoDB Diagnostic and Startup Script

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "StudentBuddy - MongoDB Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB Installation
Write-Host "[1/5] Checking MongoDB Installation..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MongoDB\Server") {
    Write-Host "OK - MongoDB is installed" -ForegroundColor Green
}
else {
    Write-Host "ERROR - MongoDB NOT installed" -ForegroundColor Red
    Write-Host "Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    exit 1
}

# Check MongoDB Service
Write-Host "[2/5] Checking MongoDB Service..." -ForegroundColor Yellow
try {
    $service = Get-Service -Name MongoDB -ErrorAction Stop
    Write-Host "OK - Service exists, Status: $($service.Status)" -ForegroundColor Green
    
    if ($service.Status -ne "Running") {
        Write-Host "Attempting to start service..." -ForegroundColor Yellow
        Start-Service -Name MongoDB -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}
catch {
    Write-Host "WARNING - Service not found" -ForegroundColor Yellow
}

# Create data directory
Write-Host "[3/5] Checking Data Directory..." -ForegroundColor Yellow
if (!(Test-Path "C:\data\db")) {
    New-Item -ItemType Directory -Path "C:\data\db" -Force | Out-Null
    Write-Host "Created C:\data\db" -ForegroundColor Green
}
else {
    Write-Host "OK - Data directory exists" -ForegroundColor Green
}

# Check if MongoDB is listening
Write-Host "[4/5] Checking if MongoDB is running..." -ForegroundColor Yellow
$portCheck = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "OK - MongoDB is running on port 27017" -ForegroundColor Green
}
else {
    Write-Host "ERROR - MongoDB is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "TO START MONGODB MANUALLY:" -ForegroundColor Cyan
    Write-Host "1. Open NEW PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Run: cd 'C:\Program Files\MongoDB\Server\7.0\bin'" -ForegroundColor White
    Write-Host "3. Run: .\mongod.exe --dbpath C:\data\db" -ForegroundColor White
    Write-Host ""
    Write-Host "OR USE MONGODB ATLAS (Recommended):" -ForegroundColor Cyan
    Write-Host "https://www.mongodb.com/cloud/atlas" -ForegroundColor White
    Write-Host ""
    Read-Host "Press ENTER to exit"
    exit 1
}

# Test connection
Write-Host "[5/5] MongoDB Status: READY" -ForegroundColor Green
Write-Host ""
Write-Host "Connection String: mongodb://localhost:27017/studentbuddy" -ForegroundColor White
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"
& node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
