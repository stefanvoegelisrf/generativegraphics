import GUI from 'lil-gui';
import p5 from 'p5';

let sketch = function (p5Library: p5) {
    let gui: GUI;
    let settings = {
        backgroundColor: { r: 0, g: 0, b: 0 },
        backgroundOpacity: 30,
        amountOfLines: 30,
        spacingMultiplier: .5,
        speed: 1,
        red: 255,
        green: 0,
        blue: 255,
        sinMultiplier: 1,
        strokeOpacity: 100
    }

    p5Library.setup = function () {
        p5Library.createCanvas(p5Library.windowWidth, p5Library.windowHeight);
        p5Library.angleMode(p5Library.DEGREES);
        addGui();
    }

    p5Library.draw = function () {
        p5Library.background(settings.backgroundColor.r, settings.backgroundColor.g, settings.backgroundColor.b, settings.backgroundOpacity);
        let timeValue = p5Library.millis() * 0.01 * settings.speed;
        drawSpreadingLines(settings.amountOfLines, timeValue);
        drawSpreadingLines(settings.amountOfLines, timeValue);
    }
    p5Library.windowResized = function () {
        p5Library.resizeCanvas(p5Library.windowWidth, p5Library.windowHeight);
    }

    function drawSpreadingLines(
        amountOfLines: number,
        timeValue: number,
    ) {
        for (let i = amountOfLines; i > 0; i--) {
            let sinValue = Math.sin(timeValue + i) * 100;
            p5Library.strokeWeight(i * i * 0.5);
            p5Library.stroke(p5Library.map(i, amountOfLines, 0, 0, settings.red), settings.green, p5Library.map(i, 0, amountOfLines, 0, settings.blue), settings.strokeOpacity);
            let spacing = (i + 2) * i * i * settings.spacingMultiplier;
            // right lines
            p5Library.line(
                p5Library.windowWidth * 0.5 + sinValue * settings.sinMultiplier + spacing,
                0,
                p5Library.windowWidth * 0.5 + spacing,
                p5Library.height
            );

            // left lines
            p5Library.line(
                p5Library.windowWidth * 0.5 - sinValue * settings.sinMultiplier - spacing,
                0,
                p5Library.windowWidth * 0.5 - spacing,
                p5Library.height
            );
        }
    }

    function addGui() {
        gui = new GUI();
        gui.addColor(settings, "backgroundColor", 255)
            .name("Background");
        gui.add(settings, "backgroundOpacity")
            .name("Background opacity")
            .min(0)
            .max(255)
            .step(1);

        gui.add(settings, "amountOfLines")
            .name("Amount of lines")
            .min(1)
            .max(100)
            .step(1);

        gui.add(settings, "spacingMultiplier")
            .name("Spacing multiplier")
            .min(0.01)
            .max(2)
            .step(0.01);

        gui.add(settings, "speed")
            .name("Speed")
            .min(0.01)
            .max(1.5)
            .step(0.01);
        gui.add(settings, "sinMultiplier")
            .name("Sin multiplier")
            .min(0.1)
            .max(100)
            .step(.01);
        gui.add(settings, "strokeOpacity")
            .name("Stroke opacity")
            .min(0)
            .max(255)
            .step(1);

        let colorFolder = gui.addFolder("Color");
        colorFolder.add(settings, "red")
            .name("Red")
            .min(0)
            .max(255)
            .step(1);

        colorFolder.add(settings, "green")
            .name("Green")
            .min(0)
            .max(255)
            .step(1);

        colorFolder.add(settings, "blue")
            .name("Blue")
            .min(0)
            .max(255)
            .step(1);
    }
}
let instantiatedSketch = new p5(sketch);