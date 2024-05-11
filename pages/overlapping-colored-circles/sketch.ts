import p5 from 'p5';

let sketch = function (p5Library: p5) {


    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.noStroke();
    }


    p5Library.draw = function () {
        p5Library.background(250, 250, 250, 10);

        let time = p5Library.millis() * 0.001; // Scale time for smoother animation.

        let overflow = 200;

        for (let i = -overflow; i < p5Library.width + overflow; i += 30) {
            for (let j = -overflow; j < p5Library.height + overflow; j += 30) {
                let offsetX = Math.cos(time - i * 0.1) * 20;
                let offsetY = Math.sin(time + j * 0.1) * 20;

                let objectPosition = {
                    x: i + offsetX,
                    y: j + offsetY,
                };

                let circleDiameterMultiplier = 0.1 + Math.sin(time * 0.5) * 0.01;
                let circleDiameter =
                    p5Library.windowWidth > p5Library.windowHeight
                        ? p5Library.windowHeight * circleDiameterMultiplier
                        : p5Library.windowWidth * circleDiameterMultiplier;
                let circleRadius = circleDiameter * 0.5;

                let redColor = Math.abs(Math.sin(time + i * j) * 255 * 4);
                let blueColor = Math.abs(Math.cos(time + j) * 255 * 1);
                let greenColor = Math.abs(Math.cos(time + i + j) * 255 * 1);

                p5Library.fill(redColor, greenColor, blueColor, 100);

                p5Library.circle(objectPosition.x, objectPosition.y, circleDiameter);
            }
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);