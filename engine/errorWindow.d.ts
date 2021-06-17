import { IErrorWindowConstructor } from "./IErrorWindowConstructor";
export declare class ErrorWindow {
    private window;
    private options;
    private static errorWindows;
    constructor(options: IErrorWindowConstructor);
    show(): void;
    static init(): void;
}
//# sourceMappingURL=errorWindow.d.ts.map