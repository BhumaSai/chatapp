@echo off
echo Starting ChatApp...
start "ChatApp Backend" cmd /k "cd be && npm run server"
start "ChatApp Frontend" cmd /k "cd userI && npm run start"
echo Both services are starting. You can close this window.
pause