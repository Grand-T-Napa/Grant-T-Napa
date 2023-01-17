# Dogeone Game Server
## Environment requirements
- Nodejs: v14.7.5
- MySQL: 5.7+

## Environment profiles
Profile | File | NODE_ENV
------- | ------| --------
local | **.env** | ~~NODE_ENV~~
development | **dev.env** | NODE_ENV=dev
staging | **stg.env** | NODE_ENV=stg
production | **prod.env** | NODE_ENV=prod

## How to run
- **Step 1:** Clone source code `git clone https://gitlab.stisolutions.net/tsi-horse-racing-3d/game-server-new.git dogeon-game-server`
- **Step 2:** Install dependencies `cd dogeon-game-server & npm i`
- **Step 3:** Modify your **environment profile file**
- **Step 4:** Run server 
- - `npm run dev` for starting local server
- - `npm run dev:debug` for starting local server with debug mode

## Build & Deploy
- **Step 1: Build project**
	- ```npm run build```
- **Step 2: Run project with pm2**
	- ```NODE_ENV=DEV pm2 start build/index.js```
## VSCode setting

```vscode setting
{
    "editor.tabSize": 2,
    "files.exclude": {
        "**/node_modules": true
    },
    "editor.rulers": [
        120
    ],
    "workbench.colorCustomizations": {
        "editorRuler.foreground": "#303030"
    }
}
```