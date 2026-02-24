:: server\scripts\manage-mongodb.bat (for Windows)
@echo off

if "%1"=="start" (
  echo Starting MongoDB...
  net start MongoDB
  goto :eof
)

if "%1"=="stop" (
  echo Stopping MongoDB...
  net stop MongoDB
  goto :eof
)

if "%1"=="status" (
  echo MongoDB Status:
  sc query MongoDB
  goto :eof
)

if "%1"=="restart" (
  echo Restarting MongoDB...
  net stop MongoDB
  timeout /t 3
  net start MongoDB
  goto :eof
)

echo Usage: manage-mongodb.bat {start^|stop^|status^|restart}