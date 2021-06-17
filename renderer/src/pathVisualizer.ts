import * as path from "path";
import {IPathVisualizerClick} from "./IPathVisualizerClick";

export class PathVisualizer {
    private output: HTMLElement;
    private path: string[];
    private click: IPathVisualizerClick;

    public constructor(output: HTMLElement, click: IPathVisualizerClick) {
        this.output = output;
        this.path = [];
        this.click = click;
    }

    public build(): void {
        this.output.innerHTML = "";
        for (let i: number = 0; i < this.path.length; i++) {
            if (i !== 0) {
                let span: HTMLSpanElement = document.createElement("span");
                span.innerHTML = ">";
                span.classList.add("pathSplitToken");
                this.output.appendChild(span);
            }

            let span: HTMLSpanElement = document.createElement("span");
            span.innerHTML = this.path[i];
            span.setAttribute("arrIndex", i.toString());
            let global = this;
            span.addEventListener("click", function () {
                let clickedPath: string = "";
                for (let i: number = 0; i <= parseInt(<string>this.getAttribute("arrIndex")); i++) {
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

    public parseString(text: string, slash: boolean = false): void {
        this.path = text.split(slash ? "/" : "\\");
    }

    public getPath(): string {
        let str = "";

        for (let i: number = 0; i < this.path.length; i++) {
            if (i === 0) {
                str = this.path[i];
                continue;
            }

            str = path.join(str, this.path[i]);
        }

        return str;
    }
}
