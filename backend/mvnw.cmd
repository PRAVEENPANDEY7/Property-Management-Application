@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for Property Management Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "CURRENT_DIR=%~dp0"
set "MAVEN_DEFAULT_HOME=C:\Users\Acer\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0"

if not defined JAVA_HOME (
    if exist "C:\Users\Acer\.jdks\ms-17.0.18" (
        set "JAVA_HOME=C:\Users\Acer\.jdks\ms-17.0.18"
    ) else if exist "C:\Program Files\Java\jdk-25" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-25"
    )
)

if exist "%MAVEN_DEFAULT_HOME%\bin\mvn.cmd" (
    call "%MAVEN_DEFAULT_HOME%\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo ERROR: Maven installation not found. Please install Apache Maven or verify MAVEN_HOME.
exit /b 1
