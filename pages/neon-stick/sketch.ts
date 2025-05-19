import p5 from 'p5';
import GUI from 'lil-gui';
import tinycolor from 'tinycolor2';

interface RgbColor {
    r: number;
    g: number;
    b: number
}

interface NeonStickPresets {
    violetAlternate: NeonStickPreset,
    redHole: NeonStickPreset
}

interface NeonStickPreset {
    animationXMultiplier: number;
    animationYMultiplier: number;
    speed: number;
    diameter: number;
    amountOfCircles: number;
    circleDiameter: number;
    circleSpacing: number;
    iterations: number;
    iterationRotation: number;
    color: RgbColor;
    opacity: number;
    colorMultiplier: RgbColor;
    backgroundOpacity: number;
    backgroundColor: RgbColor;
}

interface NeonStickSettings extends NeonStickPreset {
    complementBackgroundColor: () => void,
    applyVioletAlternate: () => void,
    applyRedHole: () => void,
    applyPreset: (preset: NeonStickPreset) => void
}

let sketch = function (p5Library: p5) {
    let settings: NeonStickSettings = {
        animationXMultiplier: 0.004,
        animationYMultiplier: 0.01,
        speed: 1,
        diameter: 50,
        amountOfCircles: 50,
        circleDiameter: 300,
        circleSpacing: 10,
        iterations: 14,
        iterationRotation: 91,
        color: { r: 125, g: 0, b: 250 },
        opacity: 25,
        colorMultiplier: { r: 1, g: 1, b: 1 },
        backgroundOpacity: 2,
        backgroundColor: { r: 0, g: 0, b: 0 },
        complementBackgroundColor: function () {
            let bgColor = tinycolor(settings.color).complement().toRgb();
            settings.backgroundColor.r = bgColor.r;
            settings.backgroundColor.g = bgColor.g;
            settings.backgroundColor.b = bgColor.b;
        },
        applyVioletAlternate: () => settings.applyPreset(presets.violetAlternate),
        applyRedHole: () => settings.applyPreset(presets.redHole),
        applyPreset: function (preset: NeonStickPreset) {
            settings.animationXMultiplier = preset.animationXMultiplier;
            settings.animationYMultiplier = preset.animationYMultiplier;
            settings.speed = preset.speed;
            settings.diameter = preset.diameter;
            settings.amountOfCircles = preset.amountOfCircles;
            settings.circleDiameter = preset.circleDiameter;
            settings.circleSpacing = preset.circleSpacing;
            settings.iterations = preset.iterations;
            settings.iterationRotation = preset.iterationRotation;
            settings.color = preset.color;
            settings.opacity = preset.opacity;
            settings.colorMultiplier = preset.colorMultiplier;
            settings.backgroundOpacity = preset.backgroundOpacity;
            settings.backgroundColor = preset.backgroundColor;
        }
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.noStroke();
        initializeGui();
    }


    p5Library.draw = function () {
        p5Library.translate(p5Library.width * 0.5, p5Library.height * 0.5);
        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
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
        let animationFolder = gui.addFolder("Animation");
        animationFolder.add(settings, "speed").min(.1).max(5).step(.1).listen();
        animationFolder.add(settings, "diameter").min(1).max(50).step(1).listen();
        animationFolder.add(settings, "animationXMultiplier").min(-.1).max(.1).step(0.001).listen();
        animationFolder.add(settings, "animationYMultiplier").min(-.1).max(.1).step(0.001).listen();
        let circleFolder = gui.addFolder("Circles");
        circleFolder.addColor(settings, "color", 255).listen();
        circleFolder.add(settings, "opacity").min(0).max(255).step(1).listen();
        circleFolder.addColor(settings, "colorMultiplier", 1).listen();
        circleFolder.add(settings, "circleDiameter").min(1).max(300).step(1).listen();
        circleFolder.add(settings, "amountOfCircles").min(1).max(100).step(1).listen();
        circleFolder.add(settings, "circleSpacing").min(1).max(100).step(1).listen();
        circleFolder.add(settings, "iterations").min(1).max(60).step(1).listen();
        circleFolder.add(settings, "iterationRotation").min(1).max(360).step(1).listen();
        let backgroundFolder = gui.addFolder("Background");
        backgroundFolder.addColor(settings, "backgroundColor", 255).listen();
        backgroundFolder.add(settings, "backgroundOpacity").min(0).max(255).step(1).listen();
        let utilsFolder = gui.addFolder("Utils");
        utilsFolder.add(settings, "complementBackgroundColor")
        let presetFolder = gui.addFolder("Presets");
        presetFolder.add(settings, "applyVioletAlternate")
        presetFolder.add(settings, "applyRedHole")
    }

}
let instantiatedSketch = new p5(sketch);

let presets: NeonStickPresets = {
    violetAlternate: {
        animationXMultiplier: 0.004,
        animationYMultiplier: 0.01,
        speed: 1,
        diameter: 50,
        amountOfCircles: 50,
        circleDiameter: 300,
        circleSpacing: 10,
        iterations: 60,
        iterationRotation: 91,
        color: { r: 125, g: 0, b: 250 },
        opacity: 25,
        colorMultiplier: { r: 1, g: 1, b: 1 },
        backgroundOpacity: 2,
        backgroundColor: { r: 0, g: 0, b: 0 },
    },
    redHole: {
        speed: 1.9,
        diameter: 50,
        animationXMultiplier: 0.001,
        animationYMultiplier: 0.001,
        color: { r: 122, g: 115, b: 108 },
        opacity: 12,
        colorMultiplier: { r: 1, g: 0.2, b: 0.2 },
        circleDiameter: 200,
        amountOfCircles: 48,
        circleSpacing: 10,
        iterations: 60,
        iterationRotation: 223,
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 40
    }
};