import { IPathVisualizerClick } from "./IPathVisualizerClick";
export declare class PathVisualizer {
    private output;
    private path;
    private click;
    constructor(output: HTMLElement, click: IPathVisualizerClick);
    build(): void;
    parseString(text: string, slash?: boolean): void;
    getPath(): string;
}
//# sourceMappingURL=pathVisualizer.d.ts.map