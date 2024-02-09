import p5 from 'p5';

let sketch = function (p: p5) {
    let cubeLength = 32;
    const setCanvasSize = function () {
        let factorSize = 0.9;
        let squareLength = (p.windowWidth < p.windowHeight ? p.windowWidth : p.windowHeight) * factorSize;
        squareLength = Math.floor(squareLength);
        p.resizeCanvas(squareLength, squareLength);
    }

    p.setup = function () {
        p.createCanvas(500, 500, p.WEBGL);
        setCanvasSize();
        p.frameRate(12);
    }
    p.draw = function () {
        p.background(0);
        p.orbitControl(10, 10, 10, { freeRotation: true });
        p.strokeWeight(.1)
        p.stroke(255);
        for (let i = 0; i < cubeLength; i++) {
            for (let j = 0; j < cubeLength; j++) {
                for (let k = 0; k < cubeLength; k++) {
                    let x = p.map(i, 0, cubeLength, -100, 100);
                    let y = p.map(j, 0, cubeLength, -100, 100);
                    let z = p.map(k, 0, cubeLength, -100, 100);
                    p.point(x, y, z);
                }
            }
        }
    }
    p.windowResized = function () {
        setCanvasSize();
    }
}
let instantiatedSketch = new p5(sketch);