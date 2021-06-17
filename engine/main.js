"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const errorWindow_1 = require("./errorWindow");
electron_1.app.on("ready", () => {
    let win = new electron_1.BrowserWindow({
        height: 500,
        width: 1100,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    errorWindow_1.ErrorWindow.init();
    win.setMenu(null);
    win.loadFile(path.join(__dirname, "..", "renderer", "templates", "index.html"));
    win.webContents.openDevTools();
    win.on("closed", () => {
        electron_1.app.quit();
    });
});
//# sourceMappingURL=main.js.map