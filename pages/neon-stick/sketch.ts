import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let animationXMultiplier = 0.004;
    let animationYMultiplier = 0.01;
    let diameter = 10;
    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.fill(255, 0, 255);
        p5Library.noStroke();
    }


    p5Library.draw = function () {

        p5Library.background(0)
        let timeValue = p5Library.millis() * 1;
        let sinValue = Math.sin(timeValue * animationXMultiplier);
        let cosValue = Math.cos(timeValue * animationYMultiplier);
        let sinAngle =
            p5Library.map(sinValue, -1, 1, 0, p5Library.TWO_PI) * (diameter + p5Library.windowWidth * 0.125);
        let cosAngle =
            p5Library.map(cosValue, -1, 1, 0, p5Library.TWO_PI) * (diameter + p5Library.windowHeight * 0.125);
        for (let i = 0; i < 50; i++) {
            p5Library.circle(
                diameter * 2 + sinAngle - sinValue * i * 10,
                diameter * 2 + cosAngle - cosValue * i * 10,
                50
            );
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

}
let instantiatedSketch = new p5(sketch);