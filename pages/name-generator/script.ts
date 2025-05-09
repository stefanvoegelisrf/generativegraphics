import GenerateRandomName from "./totro";

document.addEventListener("DOMContentLoaded", contentLoaded);

let historyIndex = 1;


function contentLoaded() {
    generateNames();
    const generateNamesButton = document.getElementById("generate-names")!;
    generateNamesButton.addEventListener("click", generateNames);
}

function copyName(event: MouseEvent) {
    const nameElement = event.target as HTMLElement;
    navigator.clipboard.writeText(nameElement.innerText);
    if (!nameElement.classList.contains("copied"))
        nameElement.classList.add("copied");
}

function generateNames() {
    const amountOfNames = parseInt((<HTMLInputElement>document.getElementById("amountOfNames")).value);
    const minSyllables = parseInt((<HTMLInputElement>document.getElementById("minSyllables")).value)
    const maxSyllables = parseInt((<HTMLInputElement>document.getElementById("maxSyllables")).value)
    const nameList = document.getElementById("name-list")!;
    nameList.innerHTML = "";
    const historyEntries = document.getElementById("history-entries");
    const historyEntryContainer = document.createElement("details");
    historyEntryContainer.classList.add("history-entry");
    const historyEntryTitle = document.createElement("summary");
    historyEntryTitle.textContent = `${historyIndex}`;
    historyEntryContainer.appendChild(historyEntryTitle);
    const historyEntryNameList=document.createElement("div");
    historyEntryNameList.classList.add("history-entry-name-list");
    console.log(amountOfNames);
    for (let i = 0; i < amountOfNames; i++) {
        const nameElement = document.createElement("button");
        nameElement.classList.add("name-item");
        nameElement.onclick = copyName;
        const randomName = GenerateRandomName(minSyllables, maxSyllables);
        nameElement.textContent = randomName;
        nameList.appendChild(nameElement)
        const historyNameElement = nameElement.cloneNode(true) as HTMLElement;
        historyNameElement.onclick = copyName;
        historyEntryNameList.appendChild(historyNameElement);
    }
    historyEntryContainer.appendChild(historyEntryNameList);
    historyEntries?.appendChild(historyEntryContainer);
    historyIndex++;
}