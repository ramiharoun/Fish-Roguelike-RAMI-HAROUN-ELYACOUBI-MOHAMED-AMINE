@echo off
echo Renaming sprite files to correct names...
cd /d "%~dp0\assets"

rename "enemy (6).png" "enemy.png"
rename "aggressive (6).png" "aggressive.png"
rename "fast (6).png" "fast.png"
rename "heavy (6).png" "heavy.png"
rename "jellyfish (6).png" "jellyfish.png"
rename "eel (5).png" "eel.png"
rename "elite (5).png" "elite.png"
rename "boss (3).png" "boss.png"

echo Done! All sprites renamed.
pause
