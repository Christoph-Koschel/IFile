import { IErrorWindowCloseEvent } from "./IErrorWindowCloseEvent";
import { BrowserWindow } from "electron";
export interface IErrorWindowConstructor {
    message: string;
    title: string;
    onclose: {
        (event: IErrorWindowCloseEvent): void;
    };
    parent: BrowserWindow;
}
//# sourceMappingURL=IErrorWindowConstructor.d.ts.map