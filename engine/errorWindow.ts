import {BrowserWindow, ipcMain, remote} from "electron";
import {IErrorWindowConstructor} from "./IErrorWindowConstructor";
import {IErrorWindowCloseEvent} from "./IErrorWindowCloseEvent";
import * as path from "path";

const errorWindows: ErrorWindow[] = [];

export class ErrorWindow {
    private window: BrowserWindow;
    private options: IErrorWindowConstructor;
    private static errorWindows: ErrorWindow[] = [];

    public constructor(options: IErrorWindowConstructor) {
        this.options = options;
        this.window = new remote.BrowserWindow({
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
            let event: IErrorWindowCloseEvent = {
                message: this.options.message,
                status: "None",
                title: this.options.title
            }

            this.options.onclose(event);
        });

        ErrorWindow.errorWindows.push(this);
        console.log(ErrorWindow.errorWindows);
    }

    public show() {
        this.window.show();
    }

    public static init() {
        ipcMain.on("errorWindowClose", (event, args) => {
            let index: number = parseInt(args.index);

            let obj: ErrorWindow = errorWindows[index];

            let res: IErrorWindowCloseEvent = {
                status: args.status,
                message: obj.options.message,
                title: obj.options.title
            }

            obj.options.onclose(res);
            obj.window.close();
        });
    }
}


