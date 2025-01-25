import p5 from 'p5';
import GUI from 'lil-gui';

let sketch = function (p5Library: p5) {
    let gui: GUI;
    let colorMin = 0;
    let colorMax = 255;

    let settings = {
        backgroundColor: { r: 250, g: 250, b: 250 },
        backgroundOpacity: 255,
        amountOfPoints: 500,
        baseDiameter: 200,
        baseDiameterMin: 10,
        baseDiameterMax: 400,
        alternateBaseDiameterEnabled: false,
        baseDiameterSpeed: 0.1,
        instances: 10,
        redMin: 127,
        greenMin: 127,
        blueMin: 127,
        opacity: 10,
        alternateColorEnabled: false,
        backgroundAnimationEnabled: false,
        colorChangeSpeed: 0.1
    }

    let side: number;

    p5Library.setup = function () {
        side = getCanvasSize(p5Library.windowWidth, p5Library.windowHeight);
        setBackgroundColor(settings.backgroundColor);
        p5Library.createCanvas(side, side);
        p5Library.noStroke();
        p5Library.blendMode(p5Library.BLEND);
        addGui();
        document.addEventListener("keypress", (event: KeyboardEvent) => {
            if (event.key === "g") {
                hideGui();
            }
            else if (event.key === "c") {
                hideCursor();
            }
        })
    }

    let redDirection = 1;
    let greenDirection = 1;
    let blueDirection = 1;

    let baseDiameterDirection = 1;

    p5Library.draw = function () {
        let timeDelay = 0.001;
        if (settings.backgroundAnimationEnabled) {
            let bgTime = p5Library.millis() * timeDelay;
            let bgR = Math.sin(2 + bgTime) * 127 + settings.redMin + 200;
            let bgG = Math.cos(4 - bgTime) * 127 + settings.greenMin;
            let bgB = Math.sin(5 + bgTime * 2) * 127 + settings.blueMin + 200;
            p5Library.background(bgR, bgG, bgB, settings.backgroundOpacity);
            setBackgroundColor({ r: bgR, g: bgG, b: bgB });
        }
        else {
            p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
        }

        if (settings.alternateColorEnabled) {
            if (settings.redMin <= colorMin || settings.redMin >= colorMax) {
                redDirection *= -1;
            }
            if (settings.greenMin <= colorMin || settings.greenMin >= colorMax) {
                greenDirection *= -1;
            }
            if (settings.blueMin <= colorMin || settings.blueMin >= colorMax) {
                blueDirection *= -1;
            }
            settings.redMin += 1 * redDirection * settings.colorChangeSpeed;
            settings.greenMin += 1 * greenDirection * settings.colorChangeSpeed;
            settings.blueMin += 1 * blueDirection * settings.colorChangeSpeed;
            console.log(`${redDirection}${greenDirection}${blueDirection}`)
        }

        if (settings.alternateBaseDiameterEnabled) {
            if (settings.baseDiameter <= settings.baseDiameterMin || settings.baseDiameter >= settings.baseDiameterMax) {
                baseDiameterDirection *= -1;
            }
            settings.baseDiameter += 1 * baseDiameterDirection * settings.baseDiameterSpeed;
        }

        for (let instance = 0; instance < settings.instances; instance++) {
            let time = (p5Library.millis() + instance * 1000) * timeDelay;
            for (let circle = 0; circle < settings.amountOfPoints; circle++) {
                let angle = (p5Library.TWO_PI * circle) / 100;

                let diameter = settings.baseDiameter + 50 * Math.sin(angle);

                let x = side * 0.5 + (side * 0.5 - diameter) * Math.sin(angle - time);
                let y = side * 0.5 + (side * 0.5 - diameter) * Math.cos(angle);

                let r = Math.sin(angle * 2 + time) * 127 + settings.redMin + 200;
                let g = Math.cos(angle * 4 - time) * 127 + settings.greenMin;
                let b = Math.sin(angle * 5 + time * 2) * 127 + settings.blueMin + 200;

                p5Library.fill(r, g, b, settings.opacity);

                p5Library.ellipse(x, y, diameter, diameter);
            }
        }

    }

    function hideGui() {
        gui.show(gui._hidden)
    }

    function hideCursor() {
        document.querySelector("body")!.classList.toggle("cursor-hidden");
    }

    p5Library.windowResized = function () {
        side = getCanvasSize(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.resizeCanvas(side, side);
    }

    function setBackgroundColor(color: { r: number, g: number, b: number }) {
        document.querySelector("body")!.style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
    }

    function getCanvasSize(width: number, height: number) {
        if (width >= height) {
            return height;
        } else {
            return width;
        }
    }

    function addGui() {
        gui = new GUI();

        let backgroundFolder = gui.addFolder("Background");
        backgroundFolder.addColor(settings, "backgroundColor", 255)
            .name("Color")
            .onChange(setBackgroundColor);


        backgroundFolder.add(settings, "backgroundOpacity")
            .name("Opacity")
            .min(0)
            .max(255)
            .step(1);

        backgroundFolder.add(settings, "backgroundAnimationEnabled")
            .name("Animated");


        gui.add(settings, "amountOfPoints")
            .name("Points")
            .min(20)
            .max(1000)
            .step(1);
        let baseDiameterFolder = gui.addFolder("Base diameter");


        baseDiameterFolder.add(settings, "baseDiameterMin")
            .name("Min")
            .min(10)
            .max(400)
            .step(1);

        baseDiameterFolder.add(settings, "baseDiameterMax")
            .name("Max")
            .min(10)
            .max(400)
            .step(1);

        baseDiameterFolder.add(settings, "baseDiameter")
            .name("Diameter")
            .min(settings.baseDiameterMin)
            .max(settings.baseDiameterMax)
            .step(1)
            .listen();

        baseDiameterFolder.add(settings, "alternateBaseDiameterEnabled")
            .name("Alternate base diameter");

        baseDiameterFolder.add(settings, "baseDiameterSpeed")
            .name("Speed")
            .min(0.01)
            .max(2)
            .step(0.01);

        gui.add(settings, "instances")
            .name("Instances")
            .min(1)
            .max(20)
            .step(1);

        let colorFolder = gui.addFolder("Color");

        colorFolder.add(settings, "redMin")
            .name("Red min")
            .min(colorMin)
            .max(colorMax)
            .step(1)
            .listen();

        colorFolder.add(settings, "greenMin")
            .name("Green min")
            .min(colorMin)
            .max(colorMax)
            .step(1)
            .listen();

        colorFolder.add(settings, "blueMin")
            .name("Blue min")
            .min(colorMin)
            .max(colorMax)
            .step(1)
            .listen();

        colorFolder.add(settings, "opacity")
            .name("Opacity")
            .min(0)
            .max(255)
            .step(1);

        colorFolder.add(settings, "alternateColorEnabled")
            .name("Alternate");

        colorFolder.add(settings, "colorChangeSpeed")
            .name("Speed")
            .min(0.01)
            .max(2)
            .step(0.01);
    }

}
let instantiatedSketch = new p5(sketch);