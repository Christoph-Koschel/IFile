import {PathVisualizer} from "./pathVisualizer";
import {FileThree} from "./fileThree";
import * as path from "path";
import {App, BrowserWindow, remote} from "electron";
import * as fs from "fs";
import {exec} from "child_process";
import {ErrorWindow} from "../../engine/errorWindow";

let pathVisualizer: PathVisualizer;
let fileThree: FileThree;
let openPathInput: boolean = false;
const app: App = remote.app;
const sortSettings: { // TODO add dynamic setting load
    type: "name" | "date" | "size" | "mime",
    highestOnTop: boolean
} = {
    highestOnTop: true,
    type: "name"
}

function resize() {
    (<HTMLElement>document.getElementById("fileThreeTableWrapper")).style.height =
        (parseFloat(window.getComputedStyle(<HTMLElement>document.getElementById("body")).height) -
            parseFloat(window.getComputedStyle(<HTMLElement>document.getElementById("path")).height) - 60).toString() + "px";
}

function clearClass(name: string) {
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(name);
    for (let i: number = 0; i < elements.length; i++) {
        elements[i].classList.remove(name);
    }
}

export function main() {
    window.addEventListener("resize", resize);

    pathVisualizer = new PathVisualizer(<HTMLElement>document.getElementById("pathVisualizer"), (clickedPath) => {
        pathVisualizer.parseString(clickedPath);
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    pathVisualizer.parseString(process.cwd());
    pathVisualizer.build();

    fileThree = new FileThree((entry) => {
        pathVisualizer.parseString(path.join(pathVisualizer.getPath(), entry.name));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });
    fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);

    document.getElementById("winClose")?.addEventListener("click", () => {
        remote.getCurrentWindow().close();
    });

    document.getElementById("winSize")?.addEventListener("click", () => {
        let win: BrowserWindow = remote.getCurrentWindow();
        if (win.isMaximized()) {
            (<Element>document.getElementsByClassName("window")[0]).classList.remove("fullscreen");
            win.unmaximize();
        } else {
            (<Element>document.getElementsByClassName("window")[0]).classList.add("fullscreen");
            win.maximize();
        }
    });

    document.getElementById("winMin")?.addEventListener("click", () => {
        remote.getCurrentWindow().minimize();
    });

    window.addEventListener("click", (e) => {
        if (openPathInput) {
            // @ts-ignore
            if (e.target.id !== "path" && e.target.id !== "pathEditor") {
                (<HTMLElement>document.getElementById("pathEditor")).style.display = "none";
                (<HTMLElement>document.getElementById("pathVisualizer")).style.display = "";
                openPathInput = false;
            }
        }
    });

    document.getElementById("path")?.addEventListener("dblclick", () => {
        if ((<HTMLElement>document.getElementById("pathEditor")).style.display === "none") {
            (<HTMLElement>document.getElementById("pathEditor")).style.display = "";
            // @ts-ignore
            (<HTMLElement>document.getElementById("pathEditor")).value = pathVisualizer.getPath();
            (<HTMLElement>document.getElementById("pathEditor")).focus();
            (<HTMLElement>document.getElementById("pathVisualizer")).style.display = "none";
            openPathInput = true;
        }
    });

    document.getElementById("pathEditor")?.addEventListener("keyup", (e) => {
        let editor: HTMLElement = <HTMLElement>document.getElementById("pathEditor");
        if (e.keyCode === 13) {
            // @ts-ignore
            if (editor.value === "shell") {
                exec("start powershell.exe", {
                    cwd: pathVisualizer.getPath()
                });
                pathVisualizer.build();
            } else // @ts-ignore
            if (editor.value === "cmd") {
                exec(`start cmd.exe`, {
                    cwd: pathVisualizer.getPath()
                });
                pathVisualizer.build();
            } else {
                // @ts-ignore
                if (fs.existsSync(editor.value.endsWith(":") ? editor.value + "\\" : editor.value)) {
                    // @ts-ignore
                    pathVisualizer.parseString(editor.value);
                    pathVisualizer.build();
                    fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
                } else {
                    const error: ErrorWindow = new ErrorWindow({
                        // @ts-ignore
                        message: "The given Path do not exists or is not a directory",
                        title: "Directory not exists",
                        parent: remote.getCurrentWindow(),
                        onclose: (event) => {
                            console.log("closed", event);
                        }
                    });
                    error.show();
                    // TODO Show error;
                }
            }

            document.body.click();
        }
    });

    document.getElementById("shortcutDesktop")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("desktop"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutDocuments")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("documents"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutDownloads")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("downloads"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutImages")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("pictures"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutMovies")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("videos"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutMusic")?.addEventListener("click", () => {
        pathVisualizer.parseString(app.getPath("music"));
        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("shortcutUsers")?.addEventListener("click", () => {
        if (process.platform === "win32") {
            pathVisualizer.parseString(path.join(app.getPath("desktop"), "..", ".."));
        } else {
            pathVisualizer.parseString(app.getPath("desktop"));
        }

        pathVisualizer.build();
        fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
    });

    document.getElementById("nameSortToken")?.addEventListener("click", () => {
        if (sortSettings.type !== "name") {
            clearClass("tokenActive");
            document.getElementById("nameSortToken")?.classList.add("tokenActive");
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "name";
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else if (sortSettings.highestOnTop) {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });

    document.getElementById("dateSortToken")?.addEventListener("click", () => {
        if (sortSettings.type !== "date") {
            clearClass("tokenActive");
            document.getElementById("dateSortToken")?.classList.add("tokenActive");
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "date";
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else if (sortSettings.highestOnTop) {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });

    document.getElementById("sizeSortToken")?.addEventListener("click", () => {
        if (sortSettings.type !== "size") {
            clearClass("tokenActive");
            document.getElementById("sizeSortToken")?.classList.add("tokenActive");
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "size";
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else if (sortSettings.highestOnTop) {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });

    document.getElementById("typeSortToken")?.addEventListener("click", () => {
        if (sortSettings.type !== "mime") {
            clearClass("tokenActive");
            document.getElementById("typeSortToken")?.classList.add("tokenActive");
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            sortSettings.type = "mime";
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else if (sortSettings.highestOnTop) {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-up\"></i>";
            sortSettings.highestOnTop = false;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        } else {
            (<HTMLElement>document.getElementById("sortTokenImage")).innerHTML = "<i class=\"fas fa-sort-down\"></i>";
            sortSettings.highestOnTop = true;
            fileThree.build(<HTMLElement>document.getElementById("fileThreeEntries"), pathVisualizer.getPath(), sortSettings);
        }
    });

    resize();
}
