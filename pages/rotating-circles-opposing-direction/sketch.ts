import p5 from 'p5';
import GUI from 'lil-gui';

interface RgbColor {
    r: number;
    g: number;
    b: number;
}

interface RotatingCirclesPreset {
    angle: number;
    backgroundColor: RgbColor;
    backgroundOpacity: number;
    circleDiameter: number;
    iterations: number;
    xSpacing: number;
    alternateXSpacing: boolean;
    xSpacingMin: number;
    xSpacingMax: number;
    xSpacingAlternationSpeed: number;
    increaseSizeWithDistance: boolean;
    sizeIncrease: number;
    strokeColor: RgbColor;
    strokeOpacity: number;
    strokeWeight: number;
    speed: number;
    yIterations: number;
}

interface RotatingCirclesSettings extends RotatingCirclesPreset {
    applyPreset1: () => void;
    applyPreset2: () => void;
    applyPreset: (preset: RotatingCirclesPreset) => void;
}

interface RotatingCirclesPresets {
    preset1: RotatingCirclesPreset,
    preset2: RotatingCirclesPreset,
}

let sketch = function (p5Library: p5) {
    let settings: RotatingCirclesSettings = {
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
        yIterations: 1,
        applyPreset1: () => settings.applyPreset(presets.preset1),
        applyPreset2: () => settings.applyPreset(presets.preset2),
        applyPreset: (preset: RotatingCirclesPreset) => {
            p5Library.background(settings.backgroundColor.r,settings.backgroundColor.g,settings.backgroundColor.b,255)
            settings.angle = preset.angle;
            settings.backgroundColor = preset.backgroundColor;
            settings.backgroundOpacity = preset.backgroundOpacity;
            settings.circleDiameter = preset.circleDiameter;
            settings.iterations = preset.iterations;
            settings.xSpacing = preset.xSpacing;
            settings.alternateXSpacing = preset.alternateXSpacing;
            settings.xSpacingMin = preset.xSpacingMin;
            settings.xSpacingMax = preset.xSpacingMax;
            settings.xSpacingAlternationSpeed = preset.xSpacingAlternationSpeed;
            settings.increaseSizeWithDistance = preset.increaseSizeWithDistance;
            settings.sizeIncrease = preset.sizeIncrease;
            settings.strokeColor = preset.strokeColor;
            settings.strokeOpacity = preset.strokeOpacity;
            settings.strokeWeight = preset.strokeWeight;
            settings.speed = preset.speed;
            settings.yIterations = preset.yIterations;
        }
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
        backgroundFolder.addColor(settings, "backgroundColor", 255).listen();
        backgroundFolder.add(settings, "backgroundOpacity").min(1).max(255).step(1).listen();
        let circleFolder = gui.addFolder("Circle");
        circleFolder.add(settings, "circleDiameter").min(10).max(300).step(1).listen();
        circleFolder.add(settings, "iterations").min(2).max(30).step(1).listen();
        circleFolder.add(settings, "yIterations").min(1).max(30).step(1).listen();
        let xSpacingFolder = circleFolder.addFolder("X Spacing");
        xSpacingFolder.add(settings, "xSpacing").min(1).max(200).step(1).listen();
        xSpacingFolder.add(settings, "alternateXSpacing").listen()
        xSpacingFolder.add(settings, "xSpacingAlternationSpeed").min(0.1).max(5).step(0.1).listen();
        xSpacingFolder.add(settings, "xSpacingMin").min(1).max(200).step(1).listen();
        xSpacingFolder.add(settings, "xSpacingMax").min(1).max(200).step(1).listen();
        circleFolder.add(settings, "increaseSizeWithDistance").listen();
        circleFolder.add(settings, "sizeIncrease").min(.1).max(10).step(.1).listen();
        let circleStrokeFolder = circleFolder.addFolder("Stroke");
        circleStrokeFolder.addColor(settings, "strokeColor", 255).listen();
        circleStrokeFolder.add(settings, "strokeOpacity").min(1).max(255).step(1).listen();
        circleStrokeFolder.add(settings, "strokeWeight").min(1).max(30).step(1).listen();
        let animationFolder = gui.addFolder("Animation")
        animationFolder.add(settings, "angle").step(1).listen();
        animationFolder.add(settings, "speed").min(0.1).max(5).step(0.1).listen();
        let presetFolder = gui.addFolder("Presets");
        presetFolder.add(settings, "applyPreset1");
        presetFolder.add(settings, "applyPreset2");
    }
}
let instantiatedSketch = new p5(sketch);

let presets: RotatingCirclesPresets = {
    preset1: {
        angle: 0,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 5,
        circleDiameter: 65,
        iterations: 26,
        xSpacing: 65,
        alternateXSpacing: false,
        xSpacingMin: 10,
        xSpacingMax: 200,
        xSpacingAlternationSpeed: 1,
        increaseSizeWithDistance: true,
        sizeIncrease: 2.1,
        strokeColor: { r: 255, g: 255, b: 255 },
        strokeOpacity: 1,
        strokeWeight: 30,
        speed: .1,
        yIterations: 1
    },
    preset2: {
        angle: 0,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 5,
        circleDiameter: 218,
        iterations: 3,
        xSpacing: 138,
        alternateXSpacing: true,
        xSpacingMin: 137,
        xSpacingMax: 200,
        xSpacingAlternationSpeed: .1,
        increaseSizeWithDistance: true,
        sizeIncrease: 10,
        strokeColor: { r: 255, g: 255, b: 255 },
        strokeOpacity: 122,
        strokeWeight: 30,
        speed: .1,
        yIterations: 29
    }
}