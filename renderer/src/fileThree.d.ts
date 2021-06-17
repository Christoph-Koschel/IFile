import { IThreeClick } from "./IThreeClick";
export declare class FileThree {
    private currentEntries;
    private click;
    constructor(click: IThreeClick);
    build(output: HTMLElement, locationPath: string, sort: {
        type: "name" | "date" | "size" | "mime";
        highestOnTop: boolean;
    }): void;
    private static sortByDate;
    private static sortByName;
    private static sortByMime;
    private static sortBySize;
    private static readDir;
}
//# sourceMappingURL=fileThree.d.ts.map