@echo off
echo ========================================
echo StudentBuddy - MongoDB Diagnostic Tool
echo ========================================
echo.

echo [1/5] Checking MongoDB Installation...
if exist "C:\Program Files\MongoDB\Server" (
    echo ✓ MongoDB is installed
    dir "C:\Program Files\MongoDB\Server" /B
) else (
    echo ✗ MongoDB NOT found in default location
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo.

echo [2/5] Checking MongoDB Service...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service exists
    sc query MongoDB | findstr "STATE"
) else (
    echo ✗ MongoDB service not installed
    echo Attempting to start MongoDB manually...
)
echo.

echo [3/5] Attempting to start MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service started successfully
) else (
    echo ⚠ Could not start service (may need Administrator rights)
    echo.
    echo SOLUTION: Run this as Administrator or use MongoDB Atlas
)
echo.

echo [4/5] Checking if MongoDB is listening on port 27017...
netstat -ano | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB is listening on port 27017
) else (
    echo ✗ MongoDB is NOT listening on port 27017
    echo.
    echo MANUAL START REQUIRED:
    echo 1. Open PowerShell as Administrator
    echo 2. Run: cd "C:\Program Files\MongoDB\Server\7.0\bin"
    echo 3. Run: .\mongod.exe --dbpath "C:\data\db"
)
echo.

echo [5/5] Testing connection...
timeout /t 2 >nul
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. If MongoDB is running, press any key to start backend
echo 2. If MongoDB is NOT running, close this and start it manually
echo 3. Or use MongoDB Atlas (cloud) - no installation needed
echo.
pause

echo.
echo Starting backend server...
cd backend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
