@echo off

cd front-end

timeout 2

powershell -noexit -command "& {Set-ExecutionPolicy Unrestricted -Scope Process; npm run start}"

pause