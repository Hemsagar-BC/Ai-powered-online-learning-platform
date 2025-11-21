cd /d C:\Users\n\DevRepos\Code-flux-
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
"C:\Program Files\nodejs\npm.cmd" install --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" run dev