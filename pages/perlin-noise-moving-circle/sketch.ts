import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let x = 0;
    let y = 0;
    let noiseX = p5Library.random(1, 10000);
    let noiseY = p5Library.random(1, 10000);
    let opacityAlternationDirection = -1;
    let radiusAlternationDirection = -1;
    let initialRadius = 160;
    let initialOpacity = 15;
    let settings = {
        noiseStep: 0.005,
        speed: 40,
        desiredRadius: initialRadius,
        startStopStep: 1,
        startStop: function () {
            if (!settings.isStopping && settings.radius >= 0) settings.isStopping = true;
            else if (!settings.isStarting) settings.isStarting = true;
        },
        isStopping: false,
        isStarting: false,
        opacity: initialOpacity,
        alternateOpacity: false,
        opacityMin: initialOpacity - 1,
        opacityMax: 150,
        opacityAlternationMode: "linear",
        opacityAlternationStep: 1,
        alternateRadius: false,
        radiusMin: 10,
        radiusMax: 170,
        radiusAlternationMode: "linear",
        radiusAlternationStep: 1,
        radius: initialRadius
    };
    let gui: GUI;
    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        x = p5Library.random(0, p5Library.width);
        y = p5Library.random(0, p5Library.height);
        initializeGui();
    }

    p5Library.draw = function () {
        if (settings.isStopping) {
            if (settings.radius >= 0) {
                settings.radius -= settings.startStopStep;
            }
            else {
                settings.isStopping = false;
            }
        }
        else if (settings.isStarting) {
            if (settings.radius < settings.desiredRadius) {
                settings.radius += settings.startStopStep;
            }
            else {
                settings.isStarting = false;
                settings.desiredRadius = settings.radius;
            }
        }
        if (settings.radius <= 0) return;

        if (settings.alternateOpacity) {
            let opacityStep = settings.opacityAlternationStep;
            if (settings.opacityAlternationMode === "linear") {
                opacityStep = settings.opacityAlternationStep;
            }
            else if (settings.opacityAlternationMode === "noise") {
                opacityStep = p5Library.noise(p5Library.millis()) * settings.opacityAlternationStep;
            }
            settings.opacity += opacityStep * opacityAlternationDirection;
            if (settings.opacity <= settings.opacityMin || settings.opacity >= settings.opacityMax) {
                opacityAlternationDirection = opacityAlternationDirection * -1;
            }
        }

        if (settings.alternateRadius) {
            let radiusStep = settings.radiusAlternationStep;
            if (settings.radiusAlternationMode === "linear") {
                radiusStep = settings.radiusAlternationStep;
            }
            else if (settings.radiusAlternationMode === "noise") {
                radiusStep = p5Library.noise(p5Library.millis()) * settings.radiusAlternationStep;
            }
            settings.radius += radiusStep * radiusAlternationDirection;
            if (settings.radius <= settings.radiusMin || settings.radius >= settings.radiusMax) {
                radiusAlternationDirection = radiusAlternationDirection * -1;
            }
        }

        // Get noise values for both x and y coordinates
        noiseX += settings.noiseStep;
        noiseY += settings.noiseStep;

        // Convert noise values to pixel values
        let nx = p5Library.floor(p5Library.noise(noiseX) * p5Library.width);
        let ny = p5Library.floor(p5Library.noise(noiseY) * p5Library.height);

        // Move the circle using the pixel values
        x += (nx - x) / settings.speed;
        y += (ny - y) / settings.speed;

        let xDistanceToMiddle = p5Library.width * 0.5 - x;
        let mirroredX = x + xDistanceToMiddle * 2;

        p5Library.fill(255, settings.opacity);
        p5Library.ellipse(x, y, settings.radius, settings.radius);
        p5Library.ellipse(mirroredX, y, settings.radius, settings.radius)
    }

    p5Library.windowResized = function () {
    }

    let initializeGui = function () {
        let gui = new GUI();
        gui.add(settings, "noiseStep").min(0).max(10).step(0.001);
        gui.add(settings, "speed").min(1).max(100).step(1);
        gui.add(settings, "startStopStep").min(0.01).max(10).step(0.001);
        gui.add(settings, "startStop");
        gui.add(settings, "isStopping").listen().disable();
        gui.add(settings, "isStarting").listen().disable();
        let radiusFolder = gui.addFolder("Radius");
        radiusFolder.add(settings, "desiredRadius").min(1).max(300).step(1).listen();
        radiusFolder.add(settings, "radius").listen().disable();
        radiusFolder.add(settings, "alternateRadius");
        radiusFolder.add(settings, "radiusAlternationMode").options(["linear", "noise"])
        radiusFolder.add(settings, "radiusAlternationStep").min(0.01).max(10).step(0.001);
        radiusFolder.add(settings, "radiusMin").min(1).max(300).step(1);
        radiusFolder.add(settings, "radiusMax").min(1).max(300).step(1);
        let opacityFolder = gui.addFolder("Opacity");
        opacityFolder.add(settings, "opacity").min(1).max(255).step(1).listen();
        opacityFolder.add(settings, "alternateOpacity");
        opacityFolder.add(settings, "opacityAlternationMode").options(["linear", "noise"])
        opacityFolder.add(settings, "opacityAlternationStep").min(0.01).max(10).step(0.001);
        opacityFolder.add(settings, "opacityMin").min(1).max(255).step(1);
        opacityFolder.add(settings, "opacityMax").min(1).max(255).step(1);
    }
}
let instantiatedSketch = new p5(sketch);