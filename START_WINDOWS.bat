@echo off
echo ========================================
echo Prestige Coiff ^& Co - Starting Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install --legacy-peer-deps
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo.
    echo Please create a .env file in the project root.
    echo See WINDOWS_SETUP.md for instructions.
    echo.
    pause
    exit /b 1
)

echo Starting development server...
echo.
echo The website will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

