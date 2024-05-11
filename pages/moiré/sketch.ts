import p5 from 'p5';

let sketch = function (p5Library: p5) {
    const amountOfPoints = 20;

    let coordinatesX: number[] = [];
    let coordinatesY: number[] = [];

    function calculateCoordinates() {
        coordinatesX = [];
        const distanceX = p5Library.windowWidth / amountOfPoints;
        for (let i = 0; i < amountOfPoints; i++) {
            coordinatesX.push(distanceX * 0.5 * (i + 1));
        }
        coordinatesX = [...coordinatesX, ...([...coordinatesX].reverse())];
        coordinatesY = [];
        const distanceY = p5Library.windowHeight / amountOfPoints;
        for (let i = 0; i < amountOfPoints; i++) {
            coordinatesY.push(distanceY * 0.5 * (i + 1));
        }
        coordinatesY = [...coordinatesY, ...([...coordinatesY].reverse())];
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        calculateCoordinates();
        p5Library.strokeWeight(15);
    }


    p5Library.draw = function () {
        p5Library.background(0);
        for (let xI = 0; xI < coordinatesX.length; xI++) {
            for (let yI = 0; yI < coordinatesY.length - xI; yI++) {
                let additionalX = Math.sin(p5Library.millis() * 0.01 - xI) * 15;
                p5Library.stroke(170 - additionalX * xI * 0.5, 20 + yI, 200 - yI * 3, 150 - xI * 5 - yI * 3);
                // Upper left corner
                p5Library.point(coordinatesX[xI] + additionalX, coordinatesY[yI]);
                // Upper right corner
                p5Library.point(p5Library.windowWidth - coordinatesX[xI] - additionalX, coordinatesY[yI]);
                // Lower left corner
                p5Library.point(coordinatesX[xI] + additionalX, p5Library.windowHeight - coordinatesY[yI]);
                // Lower right corner
                p5Library.point(
                    p5Library.windowWidth - coordinatesX[xI] - additionalX,
                    p5Library.windowHeight - coordinatesY[yI]
                );
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
        calculateCoordinates();
    }

}
let instantiatedSketch = new p5(sketch);