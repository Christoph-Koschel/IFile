import {ipcRenderer, remote} from "electron";

function resize() {
}

export function main() {
    let searchStr = new URLSearchParams(window.location.search);

    window.addEventListener("resize", resize);

    document.getElementById("okBTN")?.addEventListener("click", () => {
        ipcRenderer.send("errorWindowClose", {
            index: searchStr.get("index"),
            status: "OK"
        });
    });

    document.getElementById("winClose")?.addEventListener("click", () => {
        remote.getCurrentWindow().close();
    });

    document.getElementById("winMin")?.addEventListener("click", () => {
        remote.getCurrentWindow().minimize();
    });

    document.getElementById("primaryColor")?.setAttribute("stop-color", "#a458d5");
    document.getElementById("secondaryColor")?.setAttribute("stop-color", "#462d9f");

    (<HTMLElement>document.getElementById("message")).innerHTML = <string>searchStr.get("message");
    (<HTMLElement>document.getElementById("title")).innerHTML = <string>searchStr.get("title");
    document.title = <string>searchStr.get("title");

    resize();
}
