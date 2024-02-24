import p5 from 'p5';

let sketch = function (p: p5) {
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        let rest = squareLength % 10;
        squareLength = squareLength - rest;
        p.resizeCanvas(squareLength, squareLength);
    }

    p.setup = function () {
        p.createCanvas(500, 500);
        setCanvasSize();
    }
    p.draw = function () {

    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);