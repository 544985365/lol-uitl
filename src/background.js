'use strict'

import {app, protocol, BrowserWindow, Menu, Tray, nativeImage,ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import * as Path from "path";

const isDevelopment = process.env.NODE_ENV !== 'production'
let tray = null
let win = null
let matchWin = null
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

// const winURL = process.env.NODE_ENV === 'development'
//     ? `http://localhost:8080`
//     : `app://./index.html`

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: false,
            preload: Path.join(__dirname, 'preload.js')
        }
    })
    win.setMenu(null)
    win.resizable = false
    win.maximizable = false
    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('close', (e) => {
        if (!win.isFocused()) {
            win.show()
        } else {
            e.preventDefault()
            win.hide()
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools({mode: 'detach'})
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    ipcMain.on('MatchUtil',()=>{
        win.hide()
        if (matchWin != null){
            matchWin.show()
        }else {
            matchWin = new BrowserWindow({
                width: 400,
                height: 700,
                parent: win,
                webPreferences: {

                    // Use pluginOptions.nodeIntegration, leave this alone
                    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
                    nodeIntegration: true,
                    contextIsolation: false,
                    preload: Path.join(__dirname, 'preload.js')
                }
            })
            if (process.env.WEBPACK_DEV_SERVER_URL) {
                // Load the url of the dev server if in development mode
                matchWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/MatchUtil')
                if (!process.env.IS_TEST) matchWin.webContents.openDevTools({mode: 'detach'})
            } else {
                createProtocol('app')
                // Load the index.html when not in development
                matchWin.loadURL('app://./index.html/#/MatchUtil')
            }
            matchWin.setMenu(null)
            matchWin.resizable = false

            matchWin.maximizable = false
            matchWin.once('ready-to-show', () => {
                matchWin.show();
            });
        }

    })

    ipcMain.on('MatchUtilClose',()=>{
        if (matchWin != null){
            matchWin.close()
            matchWin = null
        }
    })

    tray = new Tray(nativeImage.createFromPath(Path.join(__dirname, 'sullly.jpg')))
    tray.on('click', async () => {
        // 点击tray图标时触发，一般习惯点击后显示应用
        win.show()
    })
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出应用',
            click: async () => {
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
