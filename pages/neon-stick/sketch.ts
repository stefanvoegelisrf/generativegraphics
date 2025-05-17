import p5 from 'p5';
import GUI from 'lil-gui';
import tinycolor from 'tinycolor2';

let sketch = function (p5Library: p5) {
    let settings = {
        animationXMultiplier: 0.004,
        animationYMultiplier: 0.01,
        speed: 1,
        diameter: 10,
        amountOfCircles: 50,
        circleDiameter: 50,
        circleSpacing: 10,
        iterations: 14,
        iterationRotation: 91,
        color: { r: 250, g: 146, b: 0 },
        opacity: 255,
        colorMultiplier: { r: .4, g: .4, b: 0 },
        backgroundOpacity: 200
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.noStroke();
        initializeGui();
    }


    p5Library.draw = function () {
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);

        let bgColor = tinycolor(settings.color).complement().toRgb();
        p5Library.background(bgColor.r, bgColor.g, bgColor.b, settings.backgroundOpacity);
        let timeValue = p5Library.millis() * 1;
        let sinValue = Math.sin(timeValue * settings.speed * settings.animationXMultiplier);
        let cosValue = Math.cos(timeValue * settings.speed * settings.animationYMultiplier);
        let sinAngle =
            p5Library.map(sinValue, -1, 1, 0, p5Library.TWO_PI) * (settings.diameter);
        let cosAngle =
            p5Library.map(cosValue, -1, 1, 0, p5Library.TWO_PI) * (settings.diameter);
        for (let iteration = 0; iteration < settings.iterations; iteration++) {
            p5Library.push();
            p5Library.rotate(iteration * settings.iterationRotation);
            for (let i = 0; i < settings.amountOfCircles; i++) {
                let colorMultiplier = p5Library.map(i, 0, settings.amountOfCircles, 0, 255);
                p5Library.fill(settings.color.r / 255 * colorMultiplier * settings.colorMultiplier.r, settings.color.g * settings.colorMultiplier.g, settings.color.b / 255 * colorMultiplier ** settings.colorMultiplier.b, settings.opacity);
                p5Library.circle(
                    settings.diameter * 2 + sinAngle - sinValue * i * settings.circleSpacing,
                    settings.diameter * 2 + cosAngle - cosValue * i * settings.circleSpacing,
                    settings.circleDiameter
                );
            }
            p5Library.pop();
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    let initializeGui = function () {
        let gui = new GUI();
        gui.add(settings, "speed").min(.1).max(5).step(.1);
        gui.add(settings, "diameter").min(1).max(50).step(1);
        gui.add(settings, "circleDiameter").min(1).max(100).step(1);
        gui.add(settings, "amountOfCircles").min(1).max(100).step(1);
        gui.add(settings, "circleSpacing").min(1).max(100).step(1);
        gui.add(settings, "animationXMultiplier").min(0.001).max(2).step(0.001);
        gui.add(settings, "animationYMultiplier").min(0.001).max(2).step(0.001);
        gui.add(settings, "iterations").min(1).max(60).step(1);
        gui.add(settings, "iterationRotation").min(1).max(360).step(1);
        gui.addColor(settings, "color", 255);
        gui.addColor(settings, "colorMultiplier", 1);
        gui.add(settings, "opacity").min(0).max(255).step(1);
        gui.add(settings, "backgroundOpacity").min(0).max(255).step(1);

    }

}
let instantiatedSketch = new p5(sketch);