"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileThree = void 0;
const fs = require("fs");
const path = require("path");
const mime = require("mime");
class FileThree {
    constructor(click) {
        this.currentEntries = [];
        this.click = click;
    }
    build(output, locationPath, sort) {
        let entries = FileThree.readDir(locationPath);
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
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let tr = document.createElement("tr");
            let icon = document.createElement("td");
            icon.innerHTML = (entry.folder) ? "<i class=\"far fa-folder\"></i>" : "<i class=\"far fa-file\"></i>";
            let name = document.createElement("td");
            name.innerHTML = entry.name;
            let changeData = document.createElement("td");
            changeData.innerHTML = entry.modifyDate.toDateString();
            let type = document.createElement("td");
            type.innerHTML = entry.mime;
            let size = document.createElement("td");
            size.innerHTML = !entry.folder ? entry.size.toString() : "";
            if (entry.folder) {
                let global = this;
                tr.addEventListener("dblclick", function () {
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
    static sortByDate(entries, highestOnTop) {
        entries.sort((a, b) => {
            if (a.modifyDate === null || b.modifyDate === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.modifyDate.getTime() > b.modifyDate.getTime()) {
                    return -1;
                }
                else if (a.modifyDate.getTime() < b.modifyDate.getTime()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                if (a.modifyDate.getTime() > b.modifyDate.getTime()) {
                    return 1;
                }
                else if (a.modifyDate.getTime() < b.modifyDate.getTime()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        });
        return entries;
    }
    static sortByName(entries, highestOnTop) {
        entries.sort((a, b) => {
            if (a.name === null || b.name === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return -1;
                }
                else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        });
        return entries;
    }
    static sortByMime(entries, highestOnTop) {
        entries.sort((a, b) => {
            if (a.mime === null || b.mime === null) {
                return -1;
            }
            if (highestOnTop) {
                if (a.mime.toLowerCase() > b.mime.toLowerCase()) {
                    return 1;
                }
                else if (a.mime.toLowerCase() < b.mime.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if (a.mime.toLowerCase() > b.mime.toLowerCase()) {
                    return -1;
                }
                else if (a.mime.toLowerCase() < b.mime.toLowerCase()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        });
        return entries;
    }
    static sortBySize(entries, highestOnTop) {
        entries.sort((a, b) => {
            if (highestOnTop) {
                if (a.size > b.size) {
                    return -1;
                }
                else if (a.size < b.size) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                if (a.size > b.size) {
                    return 1;
                }
                else if (a.size < b.size) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        });
        return entries;
    }
    static readDir(location) {
        let entries = fs.readdirSync(location.endsWith(":") ? location + "\\" : location);
        let res = [];
        for (let i = 0; i < entries.length; i++) {
            try {
                let stat = fs.statSync(path.join(location, entries[i]));
                res.push({
                    mime: stat.isFile() ? (mime.getType(entries[i]) === null) ? "N/A" : mime.getType(entries[i]) : "Folder",
                    name: entries[i],
                    modifyDate: stat.mtime,
                    size: stat.size,
                    folder: stat.isDirectory()
                });
            }
            catch (_a) {
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
exports.FileThree = FileThree;
//# sourceMappingURL=fileThree.js.map