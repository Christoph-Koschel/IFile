import * as fs from "fs";
import {Stats} from "fs";
import * as path from "path";
import {IThreeEntry} from "./IThreeEntry";
import {IThreeClick} from "./IThreeClick";

const mime = require("mime");

export class FileThree {
    private currentEntries: IThreeEntry[];
    private click: IThreeClick;

    public constructor(click: IThreeClick) {
        this.currentEntries = [];
        this.click = click;
    }

    public build(output: HTMLElement, locationPath: string, sort: {
        type: "name" | "date" | "size" | "mime",
        highestOnTop: boolean
    }) {
        let entries: IThreeEntry[] = FileThree.readDir(locationPath);


        switch (sort.type) {
            case "mime":
                entries = FileThree.sortByMime(entries, sort.highestOnTop);
                break;
            case "date":
                entries = FileThree.sortByDate(entries, sort.highestOnTop);
                break;
            case "name":
                entries = FileThree.sortByName(entries, sort.highestOnTop);
                break;
            case "size":
                entries = FileThree.sortBySize(entries, sort.highestOnTop);
                break;
        }

        output.innerHTML = "";
        for (let i: number = 0; i < entries.length; i++) {
            let entry: IThreeEntry = entries[i];
            let tr: HTMLTableRowElement = document.createElement("tr");

            let icon: HTMLTableDataCellElement = document.createElement("td");
            icon.innerHTML = (entry.folder) ? "<i class=\"far fa-folder\"></i>" : "<i class=\"far fa-file\"></i>";

            let name: HTMLTableDataCellElement = document.createElement("td");
            name.innerHTML = entry.name;

            let changeData: HTMLTableDataCellElement = document.createElement("td");
            changeData.innerHTML = entry.modifyDate.toDateString();

            let type: HTMLTableDataCellElement = document.createElement("td");
            type.innerHTML = entry.mime;

            let size: HTMLTableDataCellElement = document.createElement("td");
            size.innerHTML = !entry.folder ? entry.size.toString() : "";

            if (entry.folder) {
                let global = this;
                tr.addEventListener("dblclick", function () {
                    // @ts-ignore
                    this.entry = entry;
                    global.click(entry);
                });
            }

            tr.appendChild(icon);
            tr.appendChild(name);
            tr.appendChild(changeData);
            tr.appendChild(type);
            tr.appendChild(size);
            output.appendChild(tr);
        }

        this.currentEntries = entries;
    }

    private static sortByDate(entries: IThreeEntry[], highestOnTop: boolean): IThreeEntry[] {
        entries.sort((a, b): number => {
            if (a.modifyDate === null || b.modifyDate === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.modifyDate.getTime() > b.modifyDate.getTime()) {
                    return -1;
                } else if (a.modifyDate.getTime() < b.modifyDate.getTime()) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a.modifyDate.getTime() > b.modifyDate.getTime()) {
                    return 1;
                } else if (a.modifyDate.getTime() < b.modifyDate.getTime()) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        return entries;
    }

    private static sortByName(entries: IThreeEntry[], highestOnTop: boolean): IThreeEntry[] {
        entries.sort((a, b) => {
            if (a.name === null || b.name === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return -1;
                } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return entries;
    }

    private static sortByMime(entries: IThreeEntry[], highestOnTop: boolean): IThreeEntry[] {
        entries.sort((a, b) => {
            if (a.mime === null || b.mime === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.mime.toLowerCase() > b.mime.toLowerCase()) {
                    return 1;
                } else if (a.mime.toLowerCase() < b.mime.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                if (a.mime.toLowerCase() > b.mime.toLowerCase()) {
                    return -1;
                } else if (a.mime.toLowerCase() < b.mime.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return entries;
    }

    private static sortBySize(entries: IThreeEntry[], highestOnTop: boolean): IThreeEntry[] {
        entries.sort((a, b): number => {
            if (highestOnTop) {
                if (a.size > b.size) {
                    return -1;
                } else if (a.size < b.size) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a.size > b.size) {
                    return 1;
                } else if (a.size < b.size) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });

        return entries;
    }

    private static readDir(location: string): IThreeEntry[] {
        let entries: string[] = fs.readdirSync(location.endsWith(":") ? location + "\\" : location);
        let res: IThreeEntry[] = [];

        for (let i: number = 0; i < entries.length; i++) {

            try {
                let stat: Stats = fs.statSync(path.join(location, entries[i]));
                res.push({
                    mime: stat.isFile() ? (mime.getType(entries[i]) === null) ? "N/A" : mime.getType(entries[i]) : "Folder",
                    name: entries[i],
                    modifyDate: stat.mtime,
                    size: stat.size,
                    folder: stat.isDirectory()
                });
            } catch {
                res.push({
                    mime: "N/A",
                    name: entries[i],
                    modifyDate: new Date(),
                    size: 0,
                    folder: false
                });
            }
        }

        return res;
    }
}
