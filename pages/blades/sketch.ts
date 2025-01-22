import p5 from 'p5';
import { GUI } from 'lil-gui';

const settings = {
    redRangeMin: 0,
    redRangeMax: 255,
    greenRangeMin: 0,
    greenRangeMax: 255,
    blueRangeMin: 0,
    blueRangeMax: 255,
    strokeOpacity: 20,
    bladeLength: 300,
    bladeRotation: 20,
    bladeStrokeMin: 1,
    bladeStrokeMax: 5,
    bladeOffsetX: 0
}

let sketch = function (p5Library: p5) {
    let maxLength: number;
    let minLength: number;

    const createBlade = (length: number, thetaAngle: number) => {
        p5Library.push();
        p5Library.translate(0, 0);
        p5Library.rotate(thetaAngle * 30);
        let strokeWeightValue = p5Library.map(length, minLength, maxLength, settings.bladeStrokeMin, settings.bladeStrokeMax);
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
        addGui();
    }



    let frameCountValue = 0.3;


    p5Library.draw = function () {
        frameCountValue += 0.01;

        p5Library.background(0, 5);
        p5Library.translate(p5Library.width * 0.5 - (settings.bladeOffsetX * 0.5), -100);
        for (let multiplier = 0; multiplier < p5Library.PI; multiplier += p5Library.PI * 0.02) {
            p5Library.translate(settings.bladeOffsetX, 20);
            p5Library.stroke(
                p5Library.map(multiplier, 0, p5Library.PI, settings.redRangeMin, settings.redRangeMax),
                p5Library.map(multiplier, 0, p5Library.PI, settings.greenRangeMin, settings.greenRangeMax),
                p5Library.map(multiplier, 0, p5Library.PI, settings.blueRangeMin, settings.blueRangeMax),
                settings.strokeOpacity
            );
            p5Library.push();
            p5Library.rotate(multiplier * settings.bladeRotation);
            createBlade(settings.bladeLength, frameCountValue * p5Library.PI + multiplier);
            p5Library.pop();
            p5Library.translate(-settings.bladeOffsetX, 0);
            p5Library.push();
            p5Library.rotate(-multiplier * settings.bladeRotation);
            createBlade(settings.bladeLength, -(frameCountValue * p5Library.PI + multiplier));
            p5Library.pop();
        }

    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    const addGui = function () {
        let gui = new GUI();
        let strokeColorFolder = gui.addFolder("Stroke color");
        strokeColorFolder.add(settings, "redRangeMin")
            .name("Red min")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "redRangeMax")
            .name("Red max")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "greenRangeMin")
            .name("Green min")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "greenRangeMax")
            .name("Green max")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "blueRangeMin")
            .name("Blue min")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "blueRangeMax")
            .name("Blue max")
            .min(0)
            .max(255)
            .step(1);
        strokeColorFolder.add(settings, "strokeOpacity")
            .name("Stroke opacity")
            .min(1)
            .max(255)
            .step(1);
        let bladeFolder = gui.addFolder("Blades");
        bladeFolder.add(settings, "bladeLength")
            .name("Length")
            .min(10)
            .max(1000)
            .step(1);
        bladeFolder.add(settings, "bladeRotation")
            .name("Rotation")
            .min(5)
            .max(180)
            .step(1);
        bladeFolder.add(settings, "bladeStrokeMin")
            .name("Stroke min")
            .min(1)
            .max(5)
            .step(1);
        bladeFolder.add(settings, "bladeStrokeMax")
            .name("Stroke max")
            .min(1)
            .max(100)
            .step(1);
        bladeFolder.add(settings, "bladeOffsetX")
            .name("Offset x")
            .min(0)
            .max(400)
            .step(1);
    }

}
let instantiatedSketch = new p5(sketch);