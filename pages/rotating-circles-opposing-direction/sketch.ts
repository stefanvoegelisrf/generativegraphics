import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let settings = {
        angle: 0,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 5,
        circleDiameter: 100,
        iterations: 2,
        xSpacing: 100,
        alternateXSpacing: true,
        xSpacingMin: 10,
        xSpacingMax: 200,
        xSpacingAlternationSpeed: 1,
        increaseSizeWithDistance: true,
        sizeIncrease: 1,
        strokeColor: { r: 255, g: 255, b: 255 },
        strokeOpacity: 255,
        strokeWeight: 1,
        speed: 1,
        yIterations: 1
    }
    let xSpacingAlternationDirection = 1;

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.angleMode(p5Library.DEGREES);
        p5Library.rectMode(p5Library.CENTER);
        initializeGui();
    }


    p5Library.draw = function () {
        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
        p5Library.noFill();
        p5Library.stroke(settings.strokeColor.r, settings.strokeColor.g, settings.strokeColor.b, settings.strokeOpacity);
        p5Library.strokeWeight(settings.strokeWeight)

        if (settings.alternateXSpacing) {
            if (settings.xSpacing <= settings.xSpacingMin || settings.xSpacing >= settings.xSpacingMax) xSpacingAlternationDirection = xSpacingAlternationDirection * -1;
            settings.xSpacing += settings.xSpacingAlternationSpeed * xSpacingAlternationDirection;
        }

        for (let i = 1; i <= settings.iterations; i++) {
            p5Library.push();
            p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
            p5Library.rotate(i % 2 == 0 ? settings.angle : -settings.angle);
            let diameter = settings.increaseSizeWithDistance ? settings.circleDiameter * i * settings.sizeIncrease : settings.circleDiameter;
            for (let y = 0; y < settings.yIterations; y++) {
                p5Library.ellipse(i * settings.xSpacing, y * i * -settings.xSpacing, diameter, diameter);
                p5Library.ellipse(i * -settings.xSpacing, y * i * settings.xSpacing, diameter, diameter);
            }
            p5Library.pop();
        }

        settings.angle = settings.angle + settings.speed;
    }
    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }
    let initializeGui = function () {
        let gui = new GUI();
        let backgroundFolder = gui.addFolder("Background");
        backgroundFolder.addColor(settings, "backgroundColor", 255);
        backgroundFolder.add(settings, "backgroundOpacity").min(1).max(255).step(1);
        let circleFolder = gui.addFolder("Circle");
        circleFolder.add(settings, "circleDiameter").min(10).max(300).step(1);
        circleFolder.add(settings, "iterations").min(2).max(30).step(1);
        circleFolder.add(settings, "yIterations").min(1).max(30).step(1);
        let xSpacingFolder = circleFolder.addFolder("X Spacing");
        xSpacingFolder.add(settings, "xSpacing").min(1).max(200).step(1).listen();
        xSpacingFolder.add(settings, "alternateXSpacing")
        xSpacingFolder.add(settings, "xSpacingAlternationSpeed").min(0.1).max(5).step(0.1);
        xSpacingFolder.add(settings, "xSpacingMin").min(1).max(200).step(1);
        xSpacingFolder.add(settings, "xSpacingMax").min(1).max(200).step(1);
        circleFolder.add(settings, "increaseSizeWithDistance");
        circleFolder.add(settings, "sizeIncrease").min(.1).max(10).step(.1)
        let circleStrokeFolder = circleFolder.addFolder("Stroke");
        circleStrokeFolder.addColor(settings, "strokeColor", 255);
        circleStrokeFolder.add(settings, "strokeOpacity").min(1).max(255).step(1);
        circleStrokeFolder.add(settings, "strokeWeight").min(1).max(30).step(1);
        let animationFolder = gui.addFolder("Animation")
        animationFolder.add(settings, "angle").step(1).listen();
        animationFolder.add(settings, "speed").min(0.1).max(5).step(0.1);
    }
}
let instantiatedSketch = new p5(sketch);