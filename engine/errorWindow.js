"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWindow = void 0;
const electron_1 = require("electron");
const path = require("path");
const errorWindows = [];
class ErrorWindow {
    constructor(options) {
        this.options = options;
        this.window = new electron_1.remote.BrowserWindow({
            frame: false,
            transparent: true,
            width: 500,
            height: 250,
            show: false,
            resizable: false,
            maximizable: false,
            parent: options.parent,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        });
        this.window.setMenu(null);
        this.window.loadFile(path.join(__dirname, "..", "renderer", "templates", "error.html"), {
            query: {
                index: errorWindows.length.toString(),
                message: this.options.message,
                title: this.options.title
            }
        });
        this.window.webContents.openDevTools();
        this.window.on("close", () => {
            let event = {
                message: this.options.message,
                status: "None",
                title: this.options.title
            };
            this.options.onclose(event);
        });
        ErrorWindow.errorWindows.push(this);
        console.log(ErrorWindow.errorWindows);
    }
    show() {
        this.window.show();
    }
    static init() {
        electron_1.ipcMain.on("errorWindowClose", (event, args) => {
            let index = parseInt(args.index);
            let obj = errorWindows[index];
            let res = {
                status: args.status,
                message: obj.options.message,
                title: obj.options.title
            };
            obj.options.onclose(res);
            obj.window.close();
        });
    }
}
exports.ErrorWindow = ErrorWindow;
ErrorWindow.errorWindows = [];
//# sourceMappingURL=errorWindow.js.map