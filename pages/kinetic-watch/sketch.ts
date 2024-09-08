import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let clockFaceImage;
    p5Library.preload = function () {
        clockFaceImage = p5Library.loadImage("./kinetic pattern 6.png");
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.angleMode(p5Library.DEGREES);
    }


    function drawHand(diameter: number, invert: boolean = false) {
        p5Library.push();
        if (invert) {
            p5Library.scale(-1, 1);
        }
        p5Library.image(clockFaceImage, -diameter * 0.5, -diameter * 0.5, diameter, diameter)
        p5Library.pop();
    }

    let getHandValues = function (): { hour: number, minute: number, second: number } {
        let hourValue = p5Library.hour() >= 12 ? p5Library.hour() - 12 : p5Library.hour();
        let minuteValue = p5Library.minute() + p5Library.map(p5Library.second(), 0, 59, 0, 100) / 100;
        let secondValue = p5Library.second() + new Date().getMilliseconds() / 1000;
        return {
            hour: p5Library.map(hourValue, 0, 11, 0, 360), minute: p5Library.map(minuteValue, 0, 59, 0, 360), second: p5Library.map(secondValue, 0, 59.999, 0, 360)
        };
    }

    let getSimulatedHandValues = function (): { hour: number, minute: number, second: number } {
        return { hour: p5Library.millis() * 0.003, minute: p5Library.millis() * 0.006, second: p5Library.millis() * 0.009 };
    }

    p5Library.draw = function () {
        let diameter =
            p5Library.windowWidth > p5Library.windowHeight ? p5Library.windowHeight * 0.5 : p5Library.windowWidth * 0.5;
        p5Library.background(220);
        let handValues = getSimulatedHandValues();
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        // Draw hour
        p5Library.push();
        p5Library.rotate(handValues.hour);
        // p5Library.noFill();
        // p5Library.strokeWeight(5);
        // p5Library.ellipse(0, -diameter * 0.5 - 25 - 5, 50);
        drawHand(diameter);
        p5Library.pop();

        // Draw minute
        p5Library.push();
        p5Library.rotate(handValues.minute);
        // p5Library.strokeWeight(5);
        // p5Library.fill(0);
        // p5Library.ellipse(0, -diameter * 0.5 - 25 - 5, 50);
        drawHand(diameter, false);
        p5Library.pop();

        // Draw second
        p5Library.push();
        p5Library.rotate(handValues.second);
        drawHand(diameter);
        p5Library.pop();
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);

    }

}
let instantiatedSketch = new p5(sketch);