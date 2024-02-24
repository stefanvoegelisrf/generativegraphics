import p5, { Vector } from 'p5';

let sketch = function (p: p5) {
    let randomPoints: p5.Vector[];
    let amountOfPoints = 100;
    let previousSquareLength = 0;
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        if (squareLength === previousSquareLength)
            return;
        randomPoints = new Array(amountOfPoints);
        for (let i = 0; i < amountOfPoints; i++) {
            randomPoints[i] = p.createVector(p.random(0, squareLength), p.random(0, squareLength));
        }
        p.resizeCanvas(squareLength, squareLength);
        previousSquareLength = squareLength;
    }

    p.setup = function () {
        p.createCanvas(500, 500);
        setCanvasSize();
    }
    p.draw = function () {
        p.background(255);
        p.stroke(0);
        p.strokeWeight(4);
        for (let i = 0; i < randomPoints.length; i++) {
            p.point(randomPoints[i].x, randomPoints[i].y);
        }
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);