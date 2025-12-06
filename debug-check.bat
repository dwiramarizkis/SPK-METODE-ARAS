@echo off
echo ========================================
echo Debug Check - Laravel + React Project
echo ========================================
echo.

echo [1/5] Checking Vite Dev Server...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Vite dev server is running
) else (
    echo [ERROR] Vite dev server is NOT running
    echo Run: npm run dev
)
echo.

echo [2/5] Checking Laravel App...
curl -s http://sistem-pendukung-keputusan.test >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Laravel app is accessible
) else (
    echo [ERROR] Laravel app is NOT accessible
    echo Check Laragon services
)
echo.

echo [3/5] Checking Files...
if exist "resources\js\main.tsx" (
    echo [OK] main.tsx exists
) else (
    echo [ERROR] main.tsx NOT found
)

if exist "resources\js\AppComponent.tsx" (
    echo [OK] AppComponent.tsx exists
) else (
    echo [ERROR] AppComponent.tsx NOT found
)

if exist "resources\css\app.css" (
    echo [OK] app.css exists
) else (
    echo [ERROR] app.css NOT found
)
echo.

echo [4/5] Checking node_modules...
if exist "node_modules" (
    echo [OK] node_modules exists
) else (
    echo [ERROR] node_modules NOT found
    echo Run: npm install
)
echo.

echo [5/5] Checking build output...
if exist "public\build" (
    echo [OK] Build directory exists
) else (
    echo [INFO] No build directory (OK for dev mode)
)
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. Make sure Vite is running: npm run dev
echo 2. Open browser: http://sistem-pendukung-keputusan.test
echo 3. Press F12 and check Console tab
echo 4. Look for logs: "Main.tsx loaded"
echo.
echo If still blank, see DEBUG_STEPS.md
echo ========================================
pause
