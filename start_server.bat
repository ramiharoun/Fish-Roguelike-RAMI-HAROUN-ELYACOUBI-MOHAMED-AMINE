@echo off
echo Starting local server for Fish Roguelike...
echo.
echo The game will open in your browser at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

cd /d "%~dp0"

REM Try python3 first
python -m http.server 8000 2>nul
if %errorlevel% neq 0 (
    REM If python doesn't work, try php
    php -S localhost:8000 2>nul
    if %errorlevel% neq 0 (
        echo ERROR: Neither Python nor PHP found!
        echo.
        echo Please install Python from: https://www.python.org/downloads/
        echo.
        pause
        exit /b 1
    )
)
