# StudentBuddy - MongoDB Connection Diagnostic
# Run this script to diagnose and fix MongoDB connection issues

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "StudentBuddy - MongoDB Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: MongoDB Installation
Write-Host "[1/6] Checking MongoDB Installation..." -ForegroundColor Yellow
$mongoPath = "C:\Program Files\MongoDB\Server"
if (Test-Path $mongoPath) {
    Write-Host "✓ MongoDB is installed" -ForegroundColor Green
    $versions = Get-ChildItem $mongoPath | Select-Object -ExpandProperty Name
    Write-Host "  Versions found: $versions" -ForegroundColor Gray
    $latestVersion = $versions | Sort-Object -Descending | Select-Object -First 1
    $mongodPath = Join-Path $mongoPath "$latestVersion\bin\mongod.exe"
    Write-Host "  Using: $mongodPath" -ForegroundColor Gray
} else {
    Write-Host "✗ MongoDB NOT installed" -ForegroundColor Red
    Write-Host "  Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "  OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Check 2: MongoDB Service
Write-Host "[2/6] Checking MongoDB Service..." -ForegroundColor Yellow
try {
    $service = Get-Service -Name MongoDB -ErrorAction Stop
    Write-Host "✓ MongoDB service exists" -ForegroundColor Green
    Write-Host "  Status: $($service.Status)" -ForegroundColor Gray
    
    if ($service.Status -eq "Running") {
        Write-Host "✓ MongoDB is already running!" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB service is stopped" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ MongoDB service not found" -ForegroundColor Red
    Write-Host "  Will attempt manual start..." -ForegroundColor Yellow
}
Write-Host ""

# Check 3: Data Directory
Write-Host "[3/6] Checking Data Directory..." -ForegroundColor Yellow
$dataPath = "C:\data\db"
if (!(Test-Path $dataPath)) {
    Write-Host "⚠ Data directory doesn't exist, creating..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    Write-Host "✓ Created: $dataPath" -ForegroundColor Green
} else {
    Write-Host "✓ Data directory exists: $dataPath" -ForegroundColor Green
}
Write-Host ""

# Check 4: Port 27017
Write-Host "[4/6] Checking if port 27017 is in use..." -ForegroundColor Yellow
$portCheck = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "✓ MongoDB is listening on port 27017" -ForegroundColor Green
    Write-Host "  Process ID: $($portCheck.OwningProcess)" -ForegroundColor Gray
} else {
    Write-Host "✗ Port 27017 is not in use - MongoDB is NOT running" -ForegroundColor Red
}
Write-Host ""

# Check 5: Attempt to Start MongoDB
Write-Host "[5/6] Attempting to start MongoDB..." -ForegroundColor Yellow
if ($portCheck) {
    Write-Host "✓ MongoDB already running, skipping start" -ForegroundColor Green
} else {
    try {
        # Try to start service first
        $service = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
        if ($service) {
            Write-Host "  Attempting to start MongoDB service..." -ForegroundColor Gray
            Start-Service -Name MongoDB -ErrorAction Stop
            Start-Sleep -Seconds 2
            Write-Host "✓ MongoDB service started successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠ Service not available, manual start required" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "MANUAL START INSTRUCTIONS:" -ForegroundColor Cyan
            Write-Host "1. Open NEW PowerShell as Administrator" -ForegroundColor White
            Write-Host "2. Run: cd ""$mongoPath\$latestVersion\bin""" -ForegroundColor White
            Write-Host "3. Run: .\mongod.exe --dbpath ""C:\data\db""" -ForegroundColor White
            Write-Host "4. Keep that window open" -ForegroundColor White
            Write-Host ""
            Write-Host "OR USE MONGODB ATLAS (Recommended):" -ForegroundColor Cyan
            Write-Host "https://www.mongodb.com/cloud/atlas" -ForegroundColor White
            Write-Host ""
            
            $response = Read-Host "Press ENTER to continue anyway, or Ctrl+C to exit"
        }
    } catch {
        Write-Host "✗ Could not start MongoDB service" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  You may need to run this script as Administrator" -ForegroundColor Yellow
    }
}
Write-Host ""

# Check 6: Final Connection Test
Write-Host "[6/6] Testing MongoDB connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$portCheck = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "✓ MongoDB is ready for connections!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "MONGODB STATUS: READY ✓" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Connection String: mongodb://localhost:27017/studentbuddy" -ForegroundColor White
    Write-Host ""
    
    # Start backend
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Set-Location -Path "$PSScriptRoot\backend"
    & node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
    
} else {
    Write-Host "✗ MongoDB is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "MONGODB STATUS: NOT RUNNING ✗" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "RECOMMENDED SOLUTION:" -ForegroundColor Yellow
    Write-Host "Use MongoDB Atlas (cloud database) - No installation needed!" -ForegroundColor White
    Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Create free account and cluster (5 minutes)" -ForegroundColor White
    Write-Host "3. Get connection string" -ForegroundColor White
    Write-Host "4. Update backend\.env with Atlas connection string" -ForegroundColor White
    Write-Host ""
}
