import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let maxLength: number;
    let minLength: number;

    const createBlade = (length: number, thetaAngle: number) => {
        p5Library.push();
        p5Library.translate(0, 0);
        p5Library.rotate(thetaAngle * 30);
        let strokeWeightValue = p5Library.map(length, minLength, maxLength, 1, 5);
        p5Library.strokeWeight(strokeWeightValue);
        p5Library.line(0, 0, 0, -length);
        p5Library.translate(0, -length);
        if (length > minLength) {
            createBlade(length * 0.9, thetaAngle * 0.5);
        }
        p5Library.pop();
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        maxLength = p5Library.height * 0.5;
        minLength = maxLength * 0.5;
        p5Library.angleMode(p5Library.DEGREES);
    }
    let frameCountValue = 0.3;


    p5Library.draw = function () {
        frameCountValue += 0.01;

        p5Library.background(0, 5);
        p5Library.translate(p5Library.width * 0.5, -100);
        for (let multiplier = 0; multiplier < p5Library.PI; multiplier += p5Library.PI * 0.02) {
            p5Library.translate(10, 20);
            p5Library.stroke(
                p5Library.map(multiplier, 0, p5Library.PI, 0, 120),
                0,
                p5Library.map(multiplier, 0, p5Library.PI, 200, 100),
                20
            );
            p5Library.push();
            p5Library.rotate(multiplier * 20);
            createBlade(300, frameCountValue * p5Library.PI + multiplier);
            p5Library.pop();
            p5Library.translate(-10, 0);
            p5Library.push();
            p5Library.rotate(-multiplier * 20);
            createBlade(300, -(frameCountValue * p5Library.PI + multiplier));
            p5Library.pop();
        }

    }

    p5Library.windowResized = function () {
    }

}
let instantiatedSketch = new p5(sketch);