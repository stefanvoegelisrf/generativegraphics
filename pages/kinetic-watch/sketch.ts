import p5 from 'p5';

let sketch = function (p5Library: p5) {


    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.angleMode(p5Library.DEGREES);
    }
    function drawPart(diameter: number) {
        p5Library.fill(0);
        p5Library.beginShape();
        p5Library.curveVertex(diameter * 0.025, 0);
        p5Library.curveVertex(0, 0);
        p5Library.curveVertex(-diameter * 0.05, -diameter * 0.25);
        p5Library.curveVertex(0, -diameter * 0.48);
        p5Library.curveVertex(diameter * 0.025, -diameter * 0.45);
        p5Library.curveVertex(diameter * 0.015, -diameter * 0.25);
        p5Library.curveVertex(0, 0);
        p5Library.curveVertex(0, 0);
        p5Library.endShape();
    }

    function drawPart2(diameter: number) {
        p5Library.line(0, 0, diameter * 0.05, diameter * 0.5);
        p5Library.line(0, 0, -diameter * 0.05, diameter * 0.5);
    }

    function drawHand(diameter: number, lineStrokeWeight: number) {
        p5Library.noFill();
        p5Library.strokeWeight(10);
        p5Library.ellipse(0, 0, diameter);
        p5Library.strokeWeight(lineStrokeWeight);
        for (let rotation = 0; rotation < 360; rotation += 40) {
            p5Library.push();
            p5Library.rotate(rotation);
            drawPart2(diameter);
            p5Library.pop();
        }
    }

    p5Library.draw = function () {
        let diameter =
            p5Library.windowWidth > p5Library.windowHeight ? p5Library.windowHeight * 0.5 : p5Library.windowWidth * 0.5;
        p5Library.background(220);
        let hourValue = p5Library.hour() >= 12 ? p5Library.hour() - 12 : p5Library.hour();
        let minuteValue = p5Library.minute() + p5Library.map(p5Library.second(), 0, 59, 0, 100) / 100;
        let secondValue = p5Library.second() + new Date().getMilliseconds() / 1000;
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        // Draw hour
        p5Library.push();
        p5Library.rotate(p5Library.map(hourValue, 0, 11, 0, 360));
        p5Library.noFill();
        p5Library.strokeWeight(5);
        p5Library.ellipse(0, -diameter * 0.5 - 25 - 5, 50);
        drawHand(diameter, 5);
        p5Library.pop();

        // Draw minute
        p5Library.push();
        p5Library.rotate(p5Library.map(minuteValue, 0, 59, 0, 360));
        p5Library.strokeWeight(5);
        p5Library.fill(0);
        p5Library.ellipse(0, -diameter * 0.5 - 25 - 5, 50);
        drawHand(diameter, 7);
        p5Library.pop();

        // Draw second
        p5Library.push();
        p5Library.rotate(p5Library.map(secondValue, 0, 59.999, 0, 360));
        drawHand(diameter, 4);
        p5Library.pop();
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);

    }

}
let instantiatedSketch = new p5(sketch);