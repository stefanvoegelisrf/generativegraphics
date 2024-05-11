import p5, { Vector } from 'p5';

let sketch = function (p5Library: p5) {
    let currentNoiseSeed = 121;
    let currentRandomSeed = 10;
    p5Library.setup = function () {
        p5Library.noiseSeed(currentNoiseSeed);
        p5Library.randomSeed(currentRandomSeed);
        p5Library.createCanvas(400, 600)
        p5Library.frameRate(1);
    }

    p5Library.draw = function () {
        const backgroundColor = getRandomBackgroundColor();
        p5Library.background(backgroundColor.r, backgroundColor.g, backgroundColor.b);
        p5Library.push();
        p5Library.noStroke();
        const fillColor = getRandomColor();
        p5Library.fill(fillColor.r, fillColor.g, fillColor.b);
        p5Library.circle(p5Library.random(100, 300), p5Library.random(50, 100), p5Library.width * 0.1);
        p5Library.pop();
        for (let i = p5Library.random(600, 700); i > 0; i -= p5Library.random(50, 80)) {
            drawMountain(i);
        }
    }

    function drawMountain(maxHeight) {
        const strokeColor = getRandomColor();
        p5Library.stroke(strokeColor.r, strokeColor.g, strokeColor.b);
        for (let i = 0; i <= p5Library.width; i++) {
            const noiseValue = p5Library.noise((p5Library.millis() + i + maxHeight * 10) * 0.0025);
            const lineHeight = 600 - noiseValue * maxHeight;
            p5Library.line(i, 600, i, lineHeight);
        }
    }

    function getRandomColor() {
        const randomColor1 = p5Library.random(55, 220);
        const randomColor2 = p5Library.random(55, 170);
        const randomColor3 = p5Library.random(70, 150);
        return { r: randomColor1, g: randomColor2, b: randomColor3 };
    }

    function getRandomBackgroundColor() {
        const randomColor1 = p5Library.random(210, 255);
        const randomColor2 = p5Library.random(210, 255);
        const randomColor3 = p5Library.random(210, 255);
        return { r: randomColor1, g: randomColor2, b: randomColor3 };
    }
}
let instantiatedSketch = new p5(sketch);