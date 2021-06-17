"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const pathVisualizer_1 = require("./pathVisualizer");
const fileThree_1 = require("./fileThree");
const path = require("path");
const electron_1 = require("electron");
const fs = require("fs");
const child_process_1 = require("child_process");
const errorWindow_1 = require("../../engine/errorWindow");
let pathVisualizer;
let fileThree;
let openPathInput = false;
const app = electron_1.remote.app;
const sortSettings = {
    highestOnTop: true,
    type: "name"
};
function resize() {
    document.getElementById("fileThreeTableWrapper").style.height =
        (parseFloat(window.getComputedStyle(document.getElementById("body")).height) -
            parseFloat(window.getComputedStyle(document.getElementById("path")).height) - 60).toString() + "px";
}
function clearClass(name) {
    let elements = document.getElementsByClassName(name);
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(name);
    }
}
function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    window.addEventListener("resize", resize);
    pathVisualizer = new pathVisualizer_1.PathVisualizer(document.getElementById("pathVisualizer"), (clickedPath) => {
        pathVisualizer.parseString(clickedPath);
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    pathVisualizer.parseString(process.cwd());
    pathVisualizer.build();
    fileThree = new fileThree_1.FileThree((entry) => {
        pathVisualizer.parseString(path.join(pathVisualizer.getPath(), entry.name));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    (_a = document.getElementById("winClose")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        electron_1.remote.getCurrentWindow().close();
    });
    (_b = document.getElementById("winSize")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        let win = electron_1.remote.getCurrentWindow();
        if (win.isMaximized()) {
            document.getElementsByClassName("window")[0].classList.remove("fullscreen");
            win.unmaximize();
        }
        else {
            document.getElementsByClassName("window")[0].classList.add("fullscreen");
            win.maximize();
        }
    });
    (_c = document.getElementById("winMin")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        electron_1.remote.getCurrentWindow().minimize();
    });
    window.addEventListener("click", (e) => {
        if (openPathInput) {
            if (e.target.id !== "path" && e.target.id !== "pathEditor") {
                document.getElementById("pathEditor").style.display = "none";
                document.getElementById("pathVisualizer").style.display = "";
                openPathInput = false;
            }
        }
    });
    (_d = document.getElementById("path")) === null || _d === void 0 ? void 0 : _d.addEventListener("dblclick", () => {
        if (document.getElementById("pathEditor").style.display === "none") {
            document.getElementById("pathEditor").style.display = "";
            document.getElementById("pathEditor").value = pathVisualizer.getPath();
            document.getElementById("pathEditor").focus();
            document.getElementById("pathVisualizer").style.display = "none";
            openPathInput = true;
        }
    });
    (_e = document.getElementById("pathEditor")) === null || _e === void 0 ? void 0 : _e.addEventListener("keyup", (e) => {
        let editor = document.getElementById("pathEditor");
        if (e.keyCode === 13) {
            if (editor.value === "shell") {
                child_process_1.exec("start powershell.exe", {
                    cwd: pathVisualizer.getPath()
                });
                pathVisualizer.build();
            }
            else if (editor.value === "cmd") {
                child_process_1.exec(`start cmd.exe`, {
                    cwd: pathVisualizer.getPath()
                });
                pathVisualizer.build();
            }
            else {
                if (fs.existsSync(editor.value.endsWith(":") ? editor.value + "\\" : editor.value)) {
                    pathVisualizer.parseString(editor.value);
                    pathVisualizer.build();
                    fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
                }
                else {
                    const error = new errorWindow_1.ErrorWindow({
                        message: "The given Path do not exists or is not a directory",
                        title: "Directory not exists",
                        parent: electron_1.remote.getCurrentWindow(),
                        onclose: (event) => {
                            console.log("closed", event);
                        }
                    });
                    error.show();
                }
            }
            document.body.click();
        }
    });
    (_f = document.getElementById("shortcutDesktop")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("desktop"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_g = document.getElementById("shortcutDocuments")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("documents"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_h = document.getElementById("shortcutDownloads")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("downloads"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_j = document.getElementById("shortcutImages")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("pictures"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_k = document.getElementById("shortcutMovies")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("videos"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_l = document.getElementById("shortcutMusic")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("music"));
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_m = document.getElementById("shortcutUsers")) === null || _m === void 0 ? void 0 : _m.addEventListener("click", () => {
        if (process.platform === "win32") {
            pathVisualizer.parseString(path.join(app.getPath("desktop"), "..", ".."));
        }
        else {
            pathVisualizer.parseString(app.getPath("desktop"));
        }
        pathVisualizer.build();
        fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    (_o = document.getElementById("nameSortToken")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", () => {
        var _a;
        if (sortSettings.type !== "name") {
            clearClass("tokenActive");
            (_a = document.getElementById("nameSortToken")) === null || _a === void 0 ? void 0 : _a.classList.add("tokenActive");
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "name";
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else if (sortSettings.highestOnTop) {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });
    (_p = document.getElementById("dateSortToken")) === null || _p === void 0 ? void 0 : _p.addEventListener("click", () => {
        var _a;
        if (sortSettings.type !== "date") {
            clearClass("tokenActive");
            (_a = document.getElementById("dateSortToken")) === null || _a === void 0 ? void 0 : _a.classList.add("tokenActive");
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "date";
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else if (sortSettings.highestOnTop) {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });
    (_q = document.getElementById("sizeSortToken")) === null || _q === void 0 ? void 0 : _q.addEventListener("click", () => {
        var _a;
        if (sortSettings.type !== "size") {
            clearClass("tokenActive");
            (_a = document.getElementById("sizeSortToken")) === null || _a === void 0 ? void 0 : _a.classList.add("tokenActive");
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "size";
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else if (sortSettings.highestOnTop) {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });
    (_r = document.getElementById("typeSortToken")) === null || _r === void 0 ? void 0 : _r.addEventListener("click", () => {
        var _a;
        if (sortSettings.type !== "mime") {
            clearClass("tokenActive");
            (_a = document.getElementById("typeSortToken")) === null || _a === void 0 ? void 0 : _a.classList.add("tokenActive");
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "mime";
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else if (sortSettings.highestOnTop) {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
        else {
            document.getElementById("sortTokenImage").innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });
    resize();
}
exports.main = main;
//# sourceMappingURL=index.js.map