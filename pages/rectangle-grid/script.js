document.addEventListener("DOMContentLoaded", contentLoaded);
let startTime = new Date();
function contentLoaded() {
    const rectangleGrid = document.getElementById("rectangle-grid");
    for (let i = 0; i < 100; i++) {
        const rectangle = document.createElement("div");
        rectangle.classList.add("rectangle");
        rectangleGrid.appendChild(rectangle);
    }
    requestAnimationFrame(animate)
}

function animate() {
    let millis = new Date().getTime() - startTime.getTime();
    const rectangles = document.getElementsByClassName("rectangle");
    for (let i = 0; i < rectangles.length; i++) {
        let element = rectangles[i];
        // if (i % 3 === 0 && millis % 1000 < 500) {
        //     element.style.width = "50%";
        // }
        // else {
        //     element.style.width = null;
        // }

        // if (i % 6 === 0 && millis % 2000 < 300) {
        //     element.style.height = "30%";
        // }
        // else {
        //     element.style.height = null;
        // }
        element.style.width = `${map(millis % 1000, 0, 1000, 0, 100)}%`
    }
    requestAnimationFrame(animate);
}

function map(value, sourceRangeStart, sourceRangeEnd, targetRangeStart, targetRangeEnd) {
    let sourceRange = sourceRangeEnd - sourceRangeStart;
    let percentValueWithinRange = (value - sourceRangeStart) / sourceRange;
    let targetRange = targetRangeEnd - targetRangeStart;
    return percentValueWithinRange * targetRange;
}