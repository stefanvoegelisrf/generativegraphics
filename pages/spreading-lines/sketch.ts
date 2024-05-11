import p5 from 'p5';

let sketch = function (p5Library: p5) {


    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    p5Library.draw = function () {
        p5Library.background(255, 255, 255, 255);
        let amountOfLines = 10;
        let timeValue = p5Library.millis() * 0.01;
        drawSpreadingLines(50, timeValue, 5, 1);
        drawSpreadingLines(50, timeValue, 1, 5);
        drawSpreadingLines(50, timeValue, 5, 1, false);
        drawSpreadingLines(50, timeValue, 1, 5, false);
    }
    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    function drawSpreadingLines(
        amountOfLines: number,
        timeValue: number,
        bottomSpacingMultiplier = 1,
        topSpacingMultiplier = 1,
        vertical = true
    ) {
        for (let i = 0; i < amountOfLines; i++) {
            let sinValue = Math.sin(timeValue + i) * 100;
            p5Library.strokeWeight(i * i * 0.5);
            p5Library.stroke(255 - i * i * 0.25, 0, 255);
            let spacing = (i + 2) * i * i;
            // right lines
            if (vertical) {
                p5Library.line(
                    p5Library.windowWidth * 0.5 + sinValue + spacing * topSpacingMultiplier,
                    0,
                    p5Library.windowWidth * 0.5 + spacing * bottomSpacingMultiplier,
                    p5Library.height
                );

                // left lines
                p5Library.line(
                    p5Library.windowWidth * 0.5 - sinValue - spacing * topSpacingMultiplier,
                    0,
                    p5Library.windowWidth * 0.5 - spacing * bottomSpacingMultiplier,
                    p5Library.height
                );
            } else {
                p5Library.line(
                    0,
                    p5Library.windowHeight * 0.5 + sinValue + spacing * topSpacingMultiplier,
                    p5Library.width,
                    p5Library.windowHeight * 0.5 + spacing * bottomSpacingMultiplier
                );

                // left lines
                p5Library.line(
                    0,
                    p5Library.windowHeight * 0.5 - sinValue - spacing * topSpacingMultiplier,
                    p5Library.width,
                    p5Library.windowHeight * 0.5 - spacing * bottomSpacingMultiplier
                );
            }
        }
    }
}
let instantiatedSketch = new p5(sketch);