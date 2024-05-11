import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let angle = 0;

    p5Library.setup = function () {
        p5Library.createCanvas(600, 600);

        p5Library.angleMode(p5Library.DEGREES);
        p5Library.rectMode(p5Library.CENTER); //mit diesem Befehl wird das Rechteck von der Mitte her gezeichnet statt von der oberen linken Ecke

    }


    p5Library.draw = function () {
        p5Library.background(0, 0, 0, 5);
        p5Library.noFill();
        p5Library.stroke(255);

        p5Library.push();
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        p5Library.rotate(-angle);
        p5Library.ellipse(100, 0, 100, 100);
        p5Library.pop();

        p5Library.push();
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        p5Library.rotate(angle);
        p5Library.ellipse(200, 0, 100, 100);
        p5Library.pop();

        angle = angle + 1;
    }
}
let instantiatedSketch = new p5(sketch);