import p5 from 'p5';
import { GUI } from 'lil-gui';

const settings = {
    speed: 1,
    blendMode: "BLEND",
    backgroundColor: { r: 0, g: 0, b: 0 },
    backgroundOpacity: 5,
    pixelDensity: 1,
    redRangeMin: 0,
    redRangeMax: 255,
    greenRangeMin: 0,
    greenRangeMax: 255,
    blueRangeMin: 0,
    blueRangeMax: 255,
    strokeOpacity: 20,
    bladeLength: 300,
    bladeRotation: 20,
    bladeRotationAlternateEnabled: false,
    bladeRotationAlternateFrom: 0,
    bladeRotationAlternateTo: 360,
    bladeRotationAlternationSpeed: 1,
    bladeStrokeMin: 1,
    bladeStrokeMax: 5,
    bladeOffsetX: 0,
    bladeOffsetXNoiseEnabled: false,
    bladeOffsetXNoiseSpeed: 1,
    bladeOffsetXNoiseMultiplier: 10,
    bladeOffsetXNoiseIntensity: 10,
}

let sketch = function (p5Library: p5) {
    let maxLength: number;
    let minLength: number;
    let gui: GUI;
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
        document.addEventListener("keypress", keyPressed);
        settings.pixelDensity = p5Library.pixelDensity();
    }

    let frameCountValue = 0.3;


    p5Library.draw = function () {
        frameCountValue += settings.speed * 0.01;

        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
        p5Library.translate(p5Library.width * 0.5 - (settings.bladeOffsetX * 0.5), 0);
        if (settings.bladeRotationAlternateEnabled) {
            alternateRotation();
        }
        let noiseOffsetX = 0;

        for (let multiplier = 0; multiplier < p5Library.PI; multiplier += p5Library.PI * 0.02) {
            if (settings.bladeOffsetXNoiseEnabled) {
                noiseOffsetX = p5Library.noise((p5Library.millis() + multiplier * settings.bladeOffsetXNoiseIntensity) * settings.bladeOffsetXNoiseSpeed * 0.001) * settings.bladeOffsetXNoiseMultiplier;
                console.log(noiseOffsetX)
            }

            p5Library.stroke(
                p5Library.map(multiplier, 0, p5Library.PI, settings.redRangeMin, settings.redRangeMax),
                p5Library.map(multiplier, 0, p5Library.PI, settings.greenRangeMin, settings.greenRangeMax),
                p5Library.map(multiplier, 0, p5Library.PI, settings.blueRangeMin, settings.blueRangeMax),
                settings.strokeOpacity
            );

            p5Library.translate(settings.bladeOffsetX, 20);

            p5Library.push();
            p5Library.translate(noiseOffsetX, 0);
            p5Library.rotate(multiplier * settings.bladeRotation);
            createBlade(settings.bladeLength, frameCountValue * p5Library.PI + multiplier);
            p5Library.pop();

            p5Library.translate(-settings.bladeOffsetX, 0);

            p5Library.push();
            p5Library.translate(-noiseOffsetX, 0);
            p5Library.rotate(-multiplier * settings.bladeRotation);
            createBlade(settings.bladeLength, -(frameCountValue * p5Library.PI + multiplier));
            p5Library.pop();
        }
    }

    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    let changePixelDensity = function (value: number) {
        p5Library.pixelDensity(value);
    }

    let keyPressed = function (event: KeyboardEvent) {
        switch (event.key) {
            case "g":
                gui.show(gui._hidden);
        }
    }

    let changeBlendMode = function (blendMode: "BLEND" | "DARKEST" | "LIGHTEST" | "DIFFERENCE" | "MULTIPLY" | "EXCLUSION" | "SCREEN" | "REPLACE" | "OVERLAY" | "HARD_LIGHT" | "SOFT_LIGHT" | "DODGE" | "BURN" | "ADD" | "NORMAL") {
        let typedBlendMode: p5.BLEND_MODE = p5Library.BLEND;
        switch (blendMode) {
            case "DIFFERENCE":
                typedBlendMode = p5Library.DIFFERENCE;
                break;
            case "DODGE":
                typedBlendMode = p5Library.DODGE;
                break;
            case "HARD_LIGHT":
                typedBlendMode = p5Library.HARD_LIGHT;
                break;
            case "NORMAL":
                typedBlendMode = p5Library.NORMAL;
                break;
            case "SOFT_LIGHT":
                typedBlendMode = p5Library.SOFT_LIGHT;
                break;
            default:
            case "BLEND":
                typedBlendMode = p5Library.BLEND;
                break;
        }
        p5Library.blendMode(typedBlendMode)
    }

    let alternationDirection = 1;

    let alternateRotation = function () {
        if (settings.bladeRotation >= settings.bladeRotationAlternateTo || settings.bladeRotation <= settings.bladeRotationAlternateFrom) {
            alternationDirection = alternationDirection * -1;
        }
        settings.bladeRotation += settings.bladeRotationAlternationSpeed * 0.01 * alternationDirection;
    }

    let bladeRotationAlternationRangeChanged = function () {
        if (!settings.bladeRotationAlternateEnabled) return;
        if (settings.bladeRotation >= settings.bladeRotationAlternateTo || settings.bladeRotation <= settings.bladeRotationAlternateFrom) {
            settings.bladeRotation = p5Library.map(1, 0, 2, settings.bladeRotationAlternateFrom, settings.bladeRotationAlternateTo);
        }
    }

    const addGui = function () {
        gui = new GUI();
        gui.add(settings, "speed")
            .name("Speed")
            .min(0.05)
            .max(3)
            .step(0.01);

        gui.add(settings, "blendMode")
            .options(["BLEND"
                , "DIFFERENCE"
                , "HARD_LIGHT"
                , "SOFT_LIGHT"
                , "DODGE"
                , "NORMAL"])
            .onChange(changeBlendMode)

        gui.addColor(settings, "backgroundColor", 255)
            .name("Background color");

        gui.add(settings, "backgroundOpacity")
            .name("Background opacity")
            .min(0)
            .max(255)
            .step(1);

        gui.add(settings, "pixelDensity")
            .name("Pixel density")
            .min(0.01)
            .max(5)
            .step(0.01)
            .listen()
            .onChange(changePixelDensity);

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
        let bladeRotationFolder = bladeFolder.addFolder("Rotation");

        bladeRotationFolder.add(settings, "bladeRotation")
            .name("Rotation")
            .min(-360)
            .max(360)
            .step(1)
            .listen();
        bladeRotationFolder.add(settings, "bladeRotationAlternateEnabled")
            .onChange(bladeRotationAlternationRangeChanged)
            .name("Alternate");

        bladeRotationFolder.add(settings, "bladeRotationAlternateFrom")
            .name("Alternate from")
            .min(-360)
            .max(360)
            .step(1)
            .onChange(bladeRotationAlternationRangeChanged);

        bladeRotationFolder.add(settings, "bladeRotationAlternateTo")
            .name("Alternate to")
            .min(-360)
            .max(360)
            .step(1)
            .onChange(bladeRotationAlternationRangeChanged);

        bladeRotationFolder.add(settings, "bladeRotationAlternationSpeed")
            .name("Alternation speed")
            .min(1)
            .max(100)
            .step(1);

        bladeFolder.add(settings, "bladeStrokeMin")
            .name("Stroke min")
            .min(1)
            .max(100)
            .step(1);
        bladeFolder.add(settings, "bladeStrokeMax")
            .name("Stroke max")
            .min(1)
            .max(100)
            .step(1);
        let bladeOffsetXFolder = bladeFolder.addFolder("Blade offset x");
        bladeOffsetXFolder.add(settings, "bladeOffsetX")
            .name("Offset x")
            .min(-400)
            .max(400)
            .step(1);
        bladeOffsetXFolder.add(settings, "bladeOffsetXNoiseEnabled")
            .name("Offset with noise");
        bladeOffsetXFolder.add(settings, "bladeOffsetXNoiseSpeed")
            .name("Noise Speed")
            .min(1)
            .max(100)
            .step(1);
        bladeOffsetXFolder.add(settings, "bladeOffsetXNoiseMultiplier")
            .name("Noise multiplier")
            .min(1)
            .max(400)
            .step(1);

        bladeOffsetXFolder.add(settings, "bladeOffsetXNoiseIntensity")
            .name("Noise intensity")
            .min(1)
            .max(1000)
            .step(1);
    }

}
let instantiatedSketch = new p5(sketch);