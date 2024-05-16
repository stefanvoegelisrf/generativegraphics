import GenerateRandomName from "./totro";

document.addEventListener("DOMContentLoaded", contentLoaded);

let historyIndex = 1;


function contentLoaded() {
    generateNames();
    const generateNamesButton = document.getElementById("generateNames")!;
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
    const nameContainer = document.getElementById("nameContainer")!;
    nameContainer.innerHTML = "";
    const historyEntries = document.getElementById("historyEntries");
    const historyEntryContainer = document.createElement("div");
    historyEntryContainer.classList.add("history-entry");
    const historyEntryTitle = document.createElement("h2");
    historyEntryTitle.textContent = `${historyIndex}`;
    historyEntryContainer.appendChild(historyEntryTitle);
    console.log(amountOfNames);
    for (let i = 0; i < amountOfNames; i++) {
        const nameElement = document.createElement("p");
        nameElement.classList.add("name-item");
        nameElement.onclick = copyName;
        const randomName = GenerateRandomName(minSyllables, maxSyllables);
        nameElement.textContent = randomName;
        nameContainer.appendChild(nameElement)
        const historyNameElement = nameElement.cloneNode(true) as HTMLElement;
        historyNameElement.onclick = copyName;
        historyEntryContainer.appendChild(historyNameElement);
    }

    historyEntries?.appendChild(historyEntryContainer);
    historyIndex++;
}