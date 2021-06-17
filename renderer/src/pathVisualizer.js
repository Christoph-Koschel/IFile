"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathVisualizer = void 0;
const path = require("path");
class PathVisualizer {
    constructor(output, click) {
        this.output = output;
        this.path = [];
        this.click = click;
    }
    build() {
        this.output.innerHTML = "";
        for (let i = 0; i < this.path.length; i++) {
            if (i !== 0) {
                let span = document.createElement("span");
                span.innerHTML = ">";
                span.classList.add("pathSplitToken");
                this.output.appendChild(span);
            }
            let span = document.createElement("span");
            span.innerHTML = this.path[i];
            span.setAttribute("arrIndex", i.toString());
            let global = this;
            span.addEventListener("click", function () {
                let clickedPath = "";
                for (let i = 0; i <= parseInt(this.getAttribute("arrIndex")); i++) {
                    if (i === 0) {
                        clickedPath = global.path[i];
                        continue;
                    }
                    clickedPath = path.join(clickedPath, global.path[i]);
                }
                global.click(clickedPath);
            });
            this.output.appendChild(span);
        }
    }
    parseString(text, slash = false) {
        this.path = text.split(slash ? "/" : "\\");
    }
    getPath() {
        let str = "";
        for (let i = 0; i < this.path.length; i++) {
            if (i === 0) {
                str = this.path[i];
                continue;
            }
            str = path.join(str, this.path[i]);
        }
        return str;
    }
}
exports.PathVisualizer = PathVisualizer;
//# sourceMappingURL=pathVisualizer.js.map