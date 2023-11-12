@echo off

cd back-end/WebAPI

start chrome.exe http://localhost:5005/swagger/index.html

powershell -noexit -command "& {$Host.UI.RawUI.WindowTitle = '.NET7 WebApi Server'; dotnet run}"

pause