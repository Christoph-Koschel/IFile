import {app, BrowserWindow} from "electron";
import * as path from "path";
import {ErrorWindow} from "./errorWindow";


app.on("ready", () => {
    let win: BrowserWindow = new BrowserWindow({
        height: 500,
        width: 1100,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    ErrorWindow.init();

    win.setMenu(null);
    win.loadFile(path.join(__dirname, "..", "renderer", "templates", "index.html"));
    win.webContents.openDevTools();

    win.on("closed", () => {
       app.quit();
    });
});
