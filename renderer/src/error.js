"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const electron_1 = require("electron");
function resize() {
}
function main() {
    var _a, _b, _c, _d, _e;
    let searchStr = new URLSearchParams(window.location.search);
    window.addEventListener("resize", resize);
    (_a = document.getElementById("okBTN")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        electron_1.ipcRenderer.send("errorWindowClose", {
            index: searchStr.get("index"),
            status: "OK"
        });
    });
    (_b = document.getElementById("winClose")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        electron_1.remote.getCurrentWindow().close();
    });
    (_c = document.getElementById("winMin")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        electron_1.remote.getCurrentWindow().minimize();
    });
    (_d = document.getElementById("primaryColor")) === null || _d === void 0 ? void 0 : _d.setAttribute("stop-color", "#a458d5");
    (_e = document.getElementById("secondaryColor")) === null || _e === void 0 ? void 0 : _e.setAttribute("stop-color", "#462d9f");
    document.getElementById("message").innerHTML = searchStr.get("message");
    document.getElementById("title").innerHTML = searchStr.get("title");
    document.title = searchStr.get("title");
    resize();
}
exports.main = main;
//# sourceMappingURL=error.js.map